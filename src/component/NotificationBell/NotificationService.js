import { supabase } from "../../supabaseClient";

async function fetchNotifications(userId) {
  const { data, error } = await supabase
    .from("notifications")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  if (error) console.error("❌ fetchNotifications error:", error);
  return data || [];
}

export async function addNotification(userId, message) {
  const newNoti = {
    user_id: userId,
    message,
    created_at: new Date().toISOString(),
    is_read: false,
  };

  const { error } = await supabase.from("notifications").insert([newNoti]);
  if (error) console.error("❌ addNotification error:", error);

  return newNoti;
}

export function listenToNotifications(userId, onNewNotification) {
  const postChannel = supabase
    .channel("new-posts")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "posts" },
      async (payload) => {
        if (payload.new.user_id !== userId) {
          const message = `มีโพสต์ใหม่จากผู้ใช้ ID ${payload.new.user_id}`;
          const noti = await addNotification(userId, message);
          onNewNotification(noti);
        }
      }
    )
    .subscribe();

  const likeChannel = supabase
    .channel("new-likes")
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "likes" },
      async (payload) => {
        try {
          // LOG payload เพื่อ debug (จะช่วยให้เห็นค่า payload.new.user_id, post_id)
          console.log("Realtime like payload:", payload?.new);

          // ดึงเจ้าของโพสต์
          const { data: postData, error: postError } = await supabase
            .from("posts")
            .select("user_id")
            .eq("id", payload.new.post_id)
            .single();

          if (postError) {
            console.error("❌ Error fetching post owner:", postError);
            return;
          }
          if (!postData) {
            console.warn("⚠️ No postData found for post_id:", payload.new.post_id);
            return;
          }

          // ป้องกันเจ้าของโพสต์ไลก์ตัวเอง
          if (payload.new.user_id === postData.user_id) return;

          // พยายามดึงชื่อจากตาราง `profiles` ก่อน (แก้ชื่อฟิลด์/ตารางตาม DB ของคุณ)
          let likerName = "ใครบางคน";
          const tryFetchProfile = async () => {
            const { data: likerData, error: likerError } = await supabase
              .from("profiles")       // ถ้าตารางของคุณชื่อ "users" ให้เปลี่ยนเป็น "users"
              .select("username")     // ถ้าคอลัมน์ชื่อ "name" หรือ "full_name" ให้เปลี่ยนตามจริง
              .eq("id", payload.new.user_id)
              .maybeSingle();         // ใช้ maybeSingle() เพื่อไม่ให้ throw เมื่อไม่พบ

            if (likerError) {
              // Log เผื่อเป็นปัญหา permission หรือ column not found
              console.error("❌ likerError from profiles:", likerError);
              return null;
            }
            return likerData;
          };

          // ถ้า profiles ไม่ได้ ให้ลองตาราง users เป็น fallback
          const tryFetchUser = async () => {
            const { data: userData, error: userError } = await supabase
              .from("users")
              .select("name, username")
              .eq("id", payload.new.user_id)
              .maybeSingle();

            if (userError) {
              console.error("❌ likerError from users:", userError);
              return null;
            }
            return userData;
          };

          const profileRes = await tryFetchProfile();
          if (profileRes && (profileRes.username || profileRes.name)) {
            likerName = profileRes.username || profileRes.name;
          } else {
            const userRes = await tryFetchUser();
            if (userRes && (userRes.username || userRes.name)) {
              likerName = userRes.username || userRes.name;
            } else {
              // ถ้าไม่พบทั้งสองที่ ให้แจ้ง log เพิ่มเติมเพื่อหาเหตุผล
              console.warn(
                "⚠️ Cannot find liker name in profiles or users for id:",
                payload.new.user_id,
                "payload:",
                payload
              );
            }
          }

          // สร้างข้อความแจ้งเตือน
          const message = `${likerName} กดถูกใจโพสต์ของคุณ ❤️`;

          // เพิ่มแจ้งเตือนให้เจ้าของโพสต์
          const noti = await addNotification(postData.user_id, message);

          // ถ้าเจ้าของโพสต์เปิดหน้าเว็บ (กำลัง subscribe อยู่) ให้เรียก callback
          if (postData.user_id === userId) {
            onNewNotification(noti);
          }
        } catch (err) {
          // จับ exception ใด ๆ
          console.error("❌ Unexpected error in like handler:", err);
        }
      }
    )
    .subscribe();

  const notiChannel = supabase
    .channel(`notifications-${userId}`)
    .on(
      "postgres_changes",
      { event: "INSERT", schema: "public", table: "notifications" },
      (payload) => {
        if (payload.new.user_id === userId) {
          onNewNotification(payload.new);
        }
      }
    )
    .subscribe();

  return () => {
    supabase.removeChannel(postChannel);
    supabase.removeChannel(likeChannel);
    supabase.removeChannel(notiChannel);
  };
}

const NotificationService = {
  fetchNotifications,
  addNotification,
  listenToNotifications,
};

export default NotificationService;
