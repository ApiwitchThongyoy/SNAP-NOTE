import { supabase } from "../../supabaseClient";


async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });
  if (error) console.error(error);
  return data || [];
}

// 🧩 เพิ่มแจ้งเตือนใหม่
export async function addNotification(userId, message) {
  const newNoti = {
    user_id: userId,
    message,
    created_at: new Date().toISOString(),
    is_read: false,
  };
  await supabase.from("notifications").insert([newNoti]);
  return newNoti;
}

// ⚡ ฟัง realtime event (เช่น posts หรือ likes)
export function listenToNotifications(userId, onNewNotification) {
  const postChannel = supabase
    .channel("new-posts")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "posts" }, async (payload) => {
      if (payload.new.user_id !== userId) {
        const message = `มีโพสต์ใหม่จากผู้ใช้ ID ${payload.new.user_id}`;
        const noti = await addNotification(userId, message);
        onNewNotification(noti);
      }
    })
    .subscribe();

  const likeChannel = supabase
    .channel("new-likes")
    .on("postgres_changes", { event: "INSERT", schema: "public", table: "likes" }, async (payload) => {
      const { data } = await supabase
        .from("posts")
        .select("user_id")
        .eq("id", payload.new.post_id)
        .single();

      if (!data) return;
      const message = `มีคนกดไลก์โพสต์ของคุณ`;
      const noti = await addNotification(data.user_id, message); // ส่งถึงเจ้าของโพสต์
      onNewNotification(noti);
    })
    .subscribe();


  return () => {
    supabase.removeChannel(postChannel);
    supabase.removeChannel(likeChannel);
  };
}

const NotificationService = {
  fetchNotifications,
  addNotification,
  listenToNotifications,
};


export default NotificationService;