import { useEffect, useState } from "react";
import {
  BsBell,
  BsPersonCircle,
  BsHeart,
  BsHeartFill,
  BsBookmark,
  BsBookmarkFill,
  BsDownload,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import AdCarousel from "../Ads/AdsDetail";

export default function MainDetail() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [saves, setSaves] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // ✅ โหลดข้อมูล user ปัจจุบัน
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error(error);
    else setUser(data.user);
  };

  // ✅ โหลดโพสต์ทั้งหมด + ดึง avatar_url มาด้วย
  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      // ดึง profiles พร้อม avatar_url ด้วย
      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url");

      if (profilesError) throw profilesError;

      // รวมข้อมูลโพสต์ + โปรไฟล์
      const merged = postsData.map((p) => ({
        ...p,
        profile: profilesData.find((u) => u.id === p.user_id),
        files: (() => {
          try {
            if (typeof p.files === "string") return JSON.parse(p.files);
            return p.files || [];
          } catch {
            return [];
          }
        })(),
      }));

      setPosts(merged);
    } catch (err) {
      console.error("❌ Error fetching posts:", err);
    } finally {
      setLoading(false);
    }
  };

  // ✅ โหลด likes/saves ของ user
  const fetchUserActions = async (userId) => {
    try {
      const { data: likeData } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", userId);
      const { data: saveData } = await supabase
        .from("saves")
        .select("post_id")
        .eq("user_id", userId);

      setLikes(likeData?.map((l) => l.post_id) || []);
      setSaves(saveData?.map((s) => s.post_id) || []);
    } catch (err) {
      console.error("❌ Error fetching user actions:", err);
    }
  };

  // ✅ toggle like
  const toggleLike = async (postId) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนกดถูกใจ");
      return;
    }
    const isLiked = likes.includes(postId);
    try {
      if (isLiked) {
        await supabase
          .from("likes")
          .delete()
          .match({ post_id: postId, user_id: user.id });
        setLikes(likes.filter((id) => id !== postId));
      } else {
        await supabase
          .from("likes")
          .insert([{ post_id: postId, user_id: user.id }]);
        setLikes([...likes, postId]);
      }
    } catch (err) {
      console.error("❌ Error toggling like:", err);
    }
  };

  // ✅ toggle save
  const toggleSave = async (postId) => {
    if (!user) {
      alert("กรุณาเข้าสู่ระบบก่อนบันทึกโพสต์");
      return;
    }
    const isSaved = saves.includes(postId);
    try {
      if (isSaved) {
        await supabase
          .from("saves")
          .delete()
          .match({ post_id: postId, user_id: user.id });
        setSaves(saves.filter((id) => id !== postId));
      } else {
        await supabase
          .from("saves")
          .insert([{ post_id: postId, user_id: user.id }]);
        setSaves([...saves, postId]);
      }
    } catch (err) {
      console.error("❌ Error toggling save:", err);
    }
  };

  // ✅ โหลดข้อมูลเริ่มต้น + realtime
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchPosts();

      // Realtime update เมื่อโพสต์มีการเปลี่ยนแปลง
      const channel = supabase
        .channel("posts-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts" },
          () => {
            console.log("📡 มีการเปลี่ยนแปลงโพสต์");
            fetchPosts();
          }
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };

    init();
  }, []);

  useEffect(() => {
    if (user) fetchUserActions(user.id);
  }, [user]);

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700">
        <div className="flex-1 max-w-lg mx-auto bg-[#7CFF70] rounded-3xl px-4 py-2">
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full rounded-3xl p-3 text-black"
          />
        </div>
        <div className="flex gap-6 text-3xl">
          <button>
            <BsBell />
          </button>
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button
              className="hover:bg-green-400 text-black rounded-3xl p-2"
              onClick={() => navigate("/main-page")}
            >
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 text-black rounded-3xl p-2"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="hover:bg-green-400 text-black rounded-3xl p-2"
              onClick={() => navigate("/collect-post")}
            >
              บันทึก
            </button>
          </div>
          <button
            className="hover:bg-green-400 text-black rounded-3xl p-2"
            onClick={() => navigate("/setting")}
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col overflow-y-auto">
          <h2 className="text-xl font-bold mb-4">โพสต์ล่าสุด</h2>

          {loading ? (
            <p>กำลังโหลดโพสต์...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-300">ยังไม่มีโพสต์</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post) => (
                <div
                  key={post.id}
                  className="bg-white text-black rounded-lg p-4 shadow"
                >
                  {/* ✅ Header (แสดงรูปโปรไฟล์จริง) */}
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    {post.profile?.avatar_url ? (
                      <img
                        src={post.profile.avatar_url}
                        alt="avatar"
                        className="w-12 h-12 rounded-full object-cover border border-gray-400"
                      />
                    ) : (
                      <BsPersonCircle size={40} className="text-gray-600" />
                    )}
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {post.profile?.username ||
                          post.profile?.email ||
                          "ผู้ใช้งาน"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {new Date(post.created_at).toLocaleString("th-TH")}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <p className="mt-2">{post.content}</p>

                  {/* Files */}
                  {Array.isArray(post.files) &&
                    post.files.map((f, idx) => (
                      <div key={idx} className="mt-3">
                        {f.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                          <img
                            src={f.url}
                            alt={f.name || "file"}
                            className="w-full rounded-lg object-contain"
                          />
                        ) : (
                          <a
                            href={f.url}
                            download
                            className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded mt-2 inline-block"
                          >
                            <BsDownload /> {f.name || "ดาวน์โหลดไฟล์"}
                          </a>
                        )}
                      </div>
                    ))}

                  {/* Buttons */}
                  <div className="flex gap-2 mt-3">
                    <button
                      className={`flex items-center gap-2 px-3 py-1 rounded ${
                        likes.includes(post.id)
                          ? "bg-red-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => toggleLike(post.id)}
                    >
                      {likes.includes(post.id) ? <BsHeartFill /> : <BsHeart />}
                      ถูกใจ
                    </button>

                    <button
                      className={`flex items-center gap-2 px-3 py-1 rounded ${
                        saves.includes(post.id)
                          ? "bg-blue-500 text-white"
                          : "bg-gray-200 text-black"
                      }`}
                      onClick={() => toggleSave(post.id)}
                    >
                      {saves.includes(post.id) ? (
                        <BsBookmarkFill />
                      ) : (
                        <BsBookmark />
                      )}
                      บันทึก
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <AdCarousel />
        </div>
      </div>
    </div>
  );
}
