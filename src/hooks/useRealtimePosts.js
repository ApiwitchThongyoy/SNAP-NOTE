import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";

export function useRealtimePosts() {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    let userId = null;

    // ดึง user id จาก Auth
    const getUserAndLoadPosts = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) return;

      userId = user.id;
      await loadPosts(userId);
      setupRealtime(userId);
    };

    // โหลดโพสต์ของ user
    const loadPosts = async (userId) => {
      const { data, error } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false });

      if (error) console.error("โหลดโพสต์ล้มเหลว:", error);
      else setPosts(data || []);
    };

    // Subscribe realtime เฉพาะโพสต์ของ user
    const setupRealtime = (userId) => {
      const channel = supabase
        .channel("posts-realtime")
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table: "posts",
            filter: `user_id=eq.${userId}`,
          },
          (payload) => {
            if (payload.eventType === "INSERT") {
              setPosts((prev) => [payload.new, ...prev]);
            } else if (payload.eventType === "UPDATE") {
              setPosts((prev) =>
                prev.map((p) => (p.id === payload.new.id ? payload.new : p))
              );
            } else if (payload.eventType === "DELETE") {
              setPosts((prev) => prev.filter((p) => p.id !== payload.old.id));
            }
          }
        )
        .subscribe();

      return () => supabase.removeChannel(channel);
    };

    getUserAndLoadPosts();

    return () => {
      supabase.removeAllChannels();
    };
  }, []);

  return posts;
}
