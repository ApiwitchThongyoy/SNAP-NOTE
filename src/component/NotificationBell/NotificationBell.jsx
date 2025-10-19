import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { BsBell } from "react-icons/bs";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // ✅ โหลดแจ้งเตือน
  useEffect(() => {
    if (!userId) return;

    const fetchNotifications = async () => {
      const { data, error } = await supabase
        .from("notifications")
        .select(`
          id, message, created_at, is_read,
          sender:profiles!notifications_user_id_fkey(username)
        `)
        .eq("receiver_id", userId)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("❌ Error fetching notifications:", error);
      } else {
        setNotifications(data || []);
      }
    };

    fetchNotifications();

    // ✅ Realtime (มีแจ้งเตือนใหม่)
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

    return () => supabase.removeChannel(channel);
  }, [userId]);

  // ✅ กดเปิด dropdown แล้ว mark ว่าอ่านแล้ว
  const markAsRead = async () => {
    const unreadIds = notifications.filter((n) => !n.is_read).map((n) => n.id);
    if (unreadIds.length === 0) return;

    const { error } = await supabase
      .from("notifications")
      .update({ is_read: true })
      .in("id", unreadIds);

    if (error) console.error("❌ markAsRead error:", error);
    else {
      setNotifications((prev) =>
        prev.map((n) => ({ ...n, is_read: true }))
      );
    }
  };

  const toggleOpen = () => {
    const next = !open;
    setOpen(next);
    if (next) markAsRead(); // ✅ mark เฉพาะตอนเปิด
  };

  // ✅ คำนวนเฉพาะที่ยังไม่อ่าน
  const unreadCount = notifications.filter((n) => !n.is_read).length;

  return (
    <div className="relative">
      {/* 🔔 Icon */}
      <div
        onClick={toggleOpen}
        className="relative cursor-pointer text-white hover:text-green-300"
      >
        <BsBell size={24} />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 rounded-full flex items-center justify-center">
            {unreadCount}
          </span>
        )}
      </div>

      {/* 📜 Dropdown */}
      {open && (
        <div className="absolute right-0 mt-2 w-80 bg-pink-50 text-black shadow-lg rounded-lg z-50">
          {notifications.length === 0 ? (
            <p className="p-3 text-center text-sm text-gray-500">
              ไม่มีการแจ้งเตือน
            </p>
          ) : (
            <ul>
              {notifications.map((n) => (
                <li
                  key={n.id}
                  className={`p-3 border-b border-gray-200 text-sm ${
                    n.is_read ? "bg-pink-50" : "bg-pink-100"
                  } hover:bg-pink-200`}
                >
                  <p className="text-sm text-gray-800">
                    <strong>{n.sender?.username || "ผู้ใช้"}</strong>{" "}
                    {n.message.includes("กดถูกใจ")
                      ? "กดถูกใจโพสต์ของคุณ ❤️"
                      : n.message}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {new Date(n.created_at).toLocaleString("th-TH")}
                  </p>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
