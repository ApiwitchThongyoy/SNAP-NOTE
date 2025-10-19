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
import NotificationBell from "../NotificationBell/NotificationBell";

export default function MainDetail() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [likes, setLikes] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const [collections, setCollections] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [newCollectionName, setNewCollectionName] = useState("");

  // ---------------------------
  // ดึงข้อมูลผู้ใช้
  // ---------------------------
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getUser();
    if (error) console.error(error);
    else setUser(data.user);
  };

  // ---------------------------
  // ดึง username ของผู้ใช้จากตาราง profiles
  // ---------------------------
  const fetchUsername = async (userId) => {
    if (!userId) return "ผู้ใช้ไม่ทราบชื่อ";
    const { data, error } = await supabase
      .from("profiles")
      .select("username")
      .eq("id", userId)
      .maybeSingle();

    if (error) {
      console.error("❌ Error fetching username:", error);
      return "ผู้ใช้ไม่ทราบชื่อ";
    }
    return data?.username || "ผู้ใช้ไม่ทราบชื่อ";
  };

  // ---------------------------
  // ดึงโพสต์ทั้งหมด
  // ---------------------------
  const fetchPosts = async () => {
    try {
      const { data: postsData, error: postsError } = await supabase
        .from("posts")
        .select("*")
        .order("created_at", { ascending: false });

      if (postsError) throw postsError;

      const { data: profilesData, error: profilesError } = await supabase
        .from("profiles")
        .select("id, username, email, avatar_url");

      if (profilesError) throw profilesError;

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

  // ---------------------------
  // ดึงโพสต์ที่ถูกถูกใจ
  // ---------------------------
  const fetchUserActions = async (userId) => {
    try {
      const { data: likeData } = await supabase
        .from("likes")
        .select("post_id")
        .eq("user_id", userId);
      setLikes(likeData?.map((l) => l.post_id) || []);
    } catch (err) {
      console.error("❌ Error fetching user actions:", err);
    }
  };

  // ---------------------------
  // ดึงโพสต์ที่ถูกบันทึก
  // ---------------------------
  const fetchSavedPosts = async (userId) => {
    const { data, error } = await supabase
      .from("collection_items")
      .select("post_id")
      .eq("user_id", userId);

    if (!error && data) setSavedPosts(data.map((item) => item.post_id));
  };

  // ---------------------------
  // สร้างการแจ้งเตือน
  // ---------------------------
  const createNotification = async (targetUserId, postId, type, message) => {
    if (!user || user.id === targetUserId) return; // ❌ ไม่แจ้งเตือนตัวเอง

    try {
      const username = await fetchUsername(user.id);
      const { error } = await supabase.from("notifications").insert([
        {
          receiver_id: targetUserId,
          sender_id: user.id,
          post_id: postId,
          type,
          message: `${username} ${message}`,
        },
      ]);
      if (error) console.error("❌ Notification insert error:", error);
    } catch (err) {
      console.error("❌ createNotification exception:", err);
    }
  };

  // ---------------------------
  // ถูกใจ / ยกเลิกถูกใจ
  // ---------------------------
  const toggleLike = async (postId) => {
    if (!user) return alert("กรุณาเข้าสู่ระบบก่อนกดถูกใจ");

    const isLiked = likes.includes(postId);
    try {
      if (isLiked) {
        await supabase.from("likes").delete().match({
          post_id: postId,
          user_id: user.id,
        });
        setLikes(likes.filter((id) => id !== postId));
      } else {
        await supabase.from("likes").insert([{ post_id: postId, user_id: user.id }]);
        setLikes([...likes, postId]);

        const targetPost = posts.find((p) => p.id === postId);
        if (targetPost)
          await createNotification(targetPost.user_id, postId, "like", "กดถูกใจโพสต์ของคุณ ❤️");
      }
    } catch (err) {
      console.error("❌ toggleLike error:", err);
    }
  };

  // ---------------------------
  // ดึงคอลเลกชัน
  // ---------------------------
  const fetchCollections = async (userId) => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId);
    if (!error) setCollections(data);
  };

  // ---------------------------
  // เปิด modal สำหรับบันทึก
  // ---------------------------
  const openSaveModal = (postId) => {
    if (!user) return alert("กรุณาเข้าสู่ระบบก่อนบันทึกโพสต์");
    setSelectedPost(postId);
    setShowModal(true);
  };

  // ---------------------------
  // บันทึกโพสต์ไปยัง collection
  // ---------------------------
  const saveToCollection = async (collectionId) => {
    if (!user || !selectedPost) return;
    await supabase.from("collection_items").insert([
      { collection_id: collectionId, post_id: selectedPost, user_id: user.id },
    ]);
    setSavedPosts([...savedPosts, selectedPost]);
    setShowModal(false);
    alert("✅ บันทึกโพสต์เรียบร้อยแล้ว");

    const targetPost = posts.find((p) => p.id === selectedPost);
    if (targetPost)
      await createNotification(targetPost.user_id, selectedPost, "save", "บันทึกโพสต์ของคุณ 💾");
  };

  // ---------------------------
  // สร้างคอลเลกชันใหม่
  // ---------------------------
  const createNewCollection = async () => {
    if (!newCollectionName.trim()) return alert("กรุณากรอกชื่อเพลย์ลิสต์");
    const { data, error } = await supabase
      .from("collections")
      .insert([{ name: newCollectionName, user_id: user.id }])
      .select()
      .single();
    if (!error && data) {
      await saveToCollection(data.id);
      setNewCollectionName("");
      fetchCollections(user.id);
    }
  };

  // ---------------------------
  // useEffect
  // ---------------------------
  useEffect(() => {
    const init = async () => {
      await fetchUser();
      await fetchPosts();

      // ✅ subscribe realtime เฉพาะครั้งเดียว
      const channel = supabase
        .channel("posts-changes")
        .on(
          "postgres_changes",
          { event: "*", schema: "public", table: "posts" },
          () => fetchPosts()
        )
        .subscribe();

      return () => {
        supabase.removeChannel(channel);
      };
    };
    init();
  }, []);

  useEffect(() => {
    if (user) {
      fetchUserActions(user.id);
      fetchCollections(user.id);
      fetchSavedPosts(user.id);
    }
  }, [user]);

  // ---------------------------
  // UI หลัก
  // ---------------------------
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
        <div className="flex gap-10 text-3xl mr-25 cursor-pointer">
          {user ? <NotificationBell userId={user.id} /> : <BsBell size={24} className="text-gray-500" />}
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <div className="flex flex-col gap-6">
            <button onClick={() => navigate("/main-page")} className="hover:bg-green-400 text-black rounded-3xl p-2">
              หน้าหลัก
            </button>
            <button onClick={() => navigate("/crate-post")} className="hover:bg-green-400 text-black rounded-3xl p-2">
              โพสต์
            </button>
            <button onClick={() => navigate("/collect-post")} className="hover:bg-green-400 text-black rounded-3xl p-2">
              บันทึก
            </button>
          </div>
          <button onClick={() => navigate("/setting")} className="hover:bg-green-400 text-black rounded-3xl p-2">
            ตั้งค่า
          </button>
        </div>

        {/* Posts */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col overflow-y-auto max-h-[calc(95.7vh-6rem)]">
          <h2 className="text-xl font-bold mb-4">โพสต์ล่าสุด</h2>

          {loading ? (
            <p>กำลังโหลดโพสต์...</p>
          ) : posts.length === 0 ? (
            <p className="text-gray-300">ยังไม่มีโพสต์</p>
          ) : (
            posts.map((post) => (
              <div key={post.id} className="bg-white text-black rounded-lg p-4 shadow mb-3">
                <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                  {post.profile?.avatar_url ? (
                    <img src={post.profile.avatar_url} alt="avatar" className="w-12 h-12 rounded-full object-cover" />
                  ) : (
                    <BsPersonCircle size={40} className="text-gray-600" />
                  )}
                  <div className="flex flex-col">
                    <span className="font-semibold">{post.profile?.username || "ผู้ใช้งาน"}</span>
                    <span className="text-xs text-gray-500">
                      {new Date(post.created_at).toLocaleString("th-TH")}
                    </span>
                  </div>
                </div>

                <p className="mt-2">{post.content}</p>

                {Array.isArray(post.files) &&
                  post.files.map((f, idx) => (
                    <div key={idx} className="mt-3">
                      {f.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                        <video src={f.url} controls className="w-full rounded-lg" />
                      ) : f.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                        <img src={f.url} alt={f.name || "file"} className="w-full rounded-lg" />
                      ) : (
                        <a href={f.url} download className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded">
                          <BsDownload /> {f.name || "ดาวน์โหลดไฟล์"}
                        </a>
                      )}
                    </div>
                  ))}

                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => toggleLike(post.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${
                      likes.includes(post.id) ? "bg-red-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {likes.includes(post.id) ? <BsHeartFill /> : <BsHeart />} ถูกใจ
                  </button>

                  <button
                    onClick={() => openSaveModal(post.id)}
                    className={`flex items-center gap-2 px-3 py-1 rounded ${
                      savedPosts.includes(post.id) ? "bg-green-500 text-white" : "bg-gray-200 text-black"
                    }`}
                  >
                    {savedPosts.includes(post.id) ? <BsBookmarkFill /> : <BsBookmark />} บันทึก
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <AdCarousel />
        </div>
      </div>

      {/* Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50">
          <div className="bg-white text-black rounded-xl w-96 p-4">
            <h2 className="text-lg font-bold mb-2">บันทึกไปยัง...</h2>
            <div className="max-h-60 overflow-y-auto">
              {collections.map((c) => (
                <button key={c.id} onClick={() => saveToCollection(c.id)} className="w-full text-left px-3 py-2 hover:bg-gray-200 rounded">
                  {c.name}
                </button>
              ))}
            </div>

            <div className="border-t my-2 pt-2">
              <input
                type="text"
                placeholder="ชื่อเพลย์ลิสต์ใหม่"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="w-full border p-2 rounded mb-2"
              />
              <button onClick={createNewCollection} className="bg-green-500 text-white w-full py-2 rounded">
                ➕ สร้างเพลย์ลิสต์ใหม่
              </button>
            </div>

            <button onClick={() => setShowModal(false)} className="mt-2 text-sm text-gray-600 underline w-full">
              ยกเลิก
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
