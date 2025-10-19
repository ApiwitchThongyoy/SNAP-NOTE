import { useEffect, useState } from "react";
import { BsBell } from "react-icons/bs";
import NotificationService from "./NotificationService";

export default function NotificationBell({ userId }) {
  const [notifications, setNotifications] = useState([]);
  const [open, setOpen] = useState(false);

  // โหลดแจ้งเตือนตอนเริ่มต้น
  useEffect(() => {
    if (!userId) return;
    NotificationService.fetchNotifications(userId).then(setNotifications);

    const unsubscribe = NotificationService.listenToNotifications(
      userId,
      (newNoti) => setNotifications((prev) => [newNoti, ...prev])
    );

    return () => unsubscribe();
  }, [userId]);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="relative text-white hover:text-white"
      >
        <BsBell size={24} />
        {notifications.some((n) => !n.is_read) && (
          <span className="absolute top-0 right-0 bg-red-500 w-2.5 h-2.5 rounded-full"></span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 mt-2 w-64 bg-white shadow-lg rounded-xl border z-50">
          <ul className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <li className="p-3 text-sm text-black text-center">
                ไม่มีการแจ้งเตือน
              </li>
            ) : (
              notifications.map((noti, i) => (
                <li
                  key={i}
                  className={`p-3 text-sm border-b text-black ${
                    noti.is_read ? "bg-black" : "bg-gray-100 font-semibold"
                  }`}
                >
                  {noti.message}
                  <br />
                  <span className="text-xs text-gray-400">
                    {new Date(noti.created_at).toLocaleString()}
                  </span>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}