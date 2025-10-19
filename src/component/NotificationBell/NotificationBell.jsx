import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { BsBell } from "react-icons/bs";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select("*")
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });
      if (!error) setNotifications(data || []);
    };

    fetchNotifications();

    // realtime listener
    const channel = supabase
      .channel("notifications")
      .on(
        "postgres_changes",
        { event: "INSERT", schema: "public", table: "notifications" },
        (payload) => {
          if (payload.new.receiver_id === userId) {
            setNotifications((prev) => [payload.new, ...prev]);
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [userId]);

  return (
    <div className="relative">
      {/* ใช้ div แทน button เพื่อเลี่ยง nested error */}
      <div
        onClick={() => setOpen(!open)}
        className="relative cursor-pointer text-white hover:text-white"
      >
        <BsBell size={24} />
        {notifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 rounded-full w-3 h-3"></span>
        )}
      </div>

      {/* dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white text-black shadow-lg rounded-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-3 text-center text-sm text-gray-500">
              No notifications
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className="p-2 border-b border-gray-200 hover:bg-gray-100 text-sm"
                >
                  {n.message}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
