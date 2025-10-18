import { supabase } from "../../supabaseClient";

// 📥 ดึงการแจ้งเตือนทั้งหมดของผู้ใช้
async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("receiver_id", userId) // ✅ ใช้ receiver_id ให้ตรงกับ DB
    .order("created_at", { ascending: false });

  if (error) console.error("❌ fetchNotifications error:", error);
  return data || [];
}

// ➕ เพิ่มการแจ้งเตือนใหม่
export async function addNotification({ sender_id, receiver_id, post_id, type, message }) {
  const { error } = await supabase.from("notifications").insert([
    {
      sender_id,
      receiver_id,
      post_id,
      type,
      message,
      is_read: false,
    },
  ]);

  if (error) console.error("❌ addNotification error:", error);
}

// 👂 ฟัง Realtime event
export function listenToNotifications(userId, onNewNotification) {
  // เมื่อมีการเพิ่ม record ใหม่ในตาราง notifications
  const channel = supabase
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        if (payload.new.receiver_id === userId) {
          onNewNotification(payload.new);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(channel);
  };
}

const NotificationService = {
  fetchNotifications,
  addNotification,
  listenToNotifications,
};

export default NotificationService;
