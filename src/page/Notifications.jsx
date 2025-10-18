import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { BsArrowLeft } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function Notifications() {
  const navigate = useNavigate();
  const [notifications, setNotifications] = useState([]);
  const [user, setUser] = useState(null);

  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (!error && data?.user) setUser(data.user);
  };

  const fetchNotifications = async (userId) => {
    const { data, error } = await supabase
      .from("notifications")
      .select("*")
      .eq("receiver_id", userId)
      .order("created_at", { ascending: false });

    if (!error && data) setNotifications(data);
  };

  useEffect(() => {
    const init = async () => {
      await fetchUser();
    };
    init();
  }, []);

  useEffect(() => {
    if (user) fetchNotifications(user.id);
  }, [user]);

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => navigate(-1)}>
          <BsArrowLeft className="text-2xl" />
        </button>
        <h1 className="text-2xl font-bold">การแจ้งเตือน</h1>
      </div>

      {notifications.length === 0 ? (
        <p className="text-gray-400 text-center">ยังไม่มีการแจ้งเตือน</p>
      ) : (
        <div className="space-y-4">
          {notifications.map((n) => (
            <div
              key={n.id}
              className="bg-gray-800 p-4 rounded-xl border border-gray-700"
            >
              <p>{n.message}</p>
              <p className="text-sm text-gray-400 mt-1">
                {new Date(n.created_at).toLocaleString("th-TH")}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
