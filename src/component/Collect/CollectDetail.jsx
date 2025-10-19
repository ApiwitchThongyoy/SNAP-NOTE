import { useEffect, useState } from "react";
import {
  BsBell,
  BsPersonCircle,
  BsDownload,
  BsTrash,
  BsPlusCircle,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import AdCarousel from "../Ads/AdsDetail";
import NotificationBell from "../NotificationBell/NotificationBell";


export default function Collect_Detail() {
  const navigate = useNavigate();
  const [, setUser] = useState(null);
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState(null);
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  // ✅ ดึงข้อมูลผู้ใช้
  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data.user) {
        setUser(data.user);
        fetchCollections(data.user.id);
      }
    };
    fetchUser();
  }, []);

  // ✅ ดึงเพลย์ลิสต์ทั้งหมดของผู้ใช้
  const fetchCollections = async (userId) => {
    const { data, error } = await supabase
      .from("collections")
      .select("*")
      .eq("user_id", userId)
      .order("created_at", { ascending: false });

    if (error) console.error("Error fetching collections:", error);
    else setCollections(data);
  };

  // ✅ ดึงโพสต์ในเพลย์ลิสต์ที่เลือก
  const fetchPostsInCollection = async (collectionId) => {
    setLoading(true);
    const { data: items, error } = await supabase
      .from("collection_items")
      .select("post_id")
      .eq("collection_id", collectionId);

    if (error) {
      console.error("Error fetching collection items:", error);
      setLoading(false);
      return;
    }

    if (!items || items.length === 0) {
      setPosts([]);
      setLoading(false);
      return;
    }

    const postIds = items.map((i) => i.post_id);

    const { data: postsData, error: postsError } = await supabase
      .from("posts")
      .select("*, profiles(username, email, avatar_url)")
      .in("id", postIds)
      .order("created_at", { ascending: false });

    if (!postsError) setPosts(postsData);
    setLoading(false);
  };

  // ✅ เพิ่มโพสต์เข้า collection
  const addPostToCollection = async (collectionId, postId) => {
    if (!collectionId || !postId) return;

    const {
      data: { user },
    } = await supabase.auth.getUser();
    if (!user) {
      setMessage("❌ กรุณาเข้าสู่ระบบก่อนเพิ่มโพสต์");
      return;
    }

    const { error } = await supabase.from("collection_items").insert([
      {
        collection_id: collectionId,
        post_id: postId,
        user_id: user.id,
      },
    ]);

    if (error) {
      console.error("Error adding post:", error);
      setMessage("❌ เกิดข้อผิดพลาดในการเพิ่มโพสต์");
    } else {
      setMessage("✅ เพิ่มโพสต์เข้าเพลย์ลิสต์สำเร็จ");
      fetchPostsInCollection(collectionId);
    }
  };

  // ✅ ลบโพสต์ออกจากเพลย์ลิสต์
  const removePostFromCollection = async (postId) => {
    if (!selectedCollection) return;
    await supabase
      .from("collection_items")
      .delete()
      .match({ collection_id: selectedCollection.id, post_id: postId });
    fetchPostsInCollection(selectedCollection.id);
  };

  // ✅ ลบทั้งคอลเลกชัน
  const removeCollection = async (collectionId) => {
    if (!window.confirm("คุณต้องการลบเพลย์ลิสต์นี้หรือไม่? 🗑️")) return;

    try {
      // ลบรายการใน collection_items ก่อน (เพื่อไม่ให้ orphan data)
      await supabase
        .from("collection_items")
        .delete()
        .eq("collection_id", collectionId);

      // ลบ collection หลัก
      const { error } = await supabase
        .from("collections")
        .delete()
        .eq("id", collectionId);

      if (error) throw error;

      // อัปเดตรายการใหม่
      setCollections(collections.filter((c) => c.id !== collectionId));

      // ถ้ากำลังดูคอลเลกชันนี้อยู่ ให้ล้างโพสต์ออก
      if (selectedCollection?.id === collectionId) {
        setSelectedCollection(null);
        setPosts([]);
      }

      setMessage("🗑️ ลบเพลย์ลิสต์สำเร็จ");
    } catch (err) {
      console.error("❌ Error deleting collection:", err);
      setMessage("❌ เกิดข้อผิดพลาดในการลบเพลย์ลิสต์");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700">
        <div className="flex-1 max-w-lg mx-auto bg-[#7CFF70] rounded-3xl px-4 py-2">
          <input
            type="text"
            placeholder="ค้นหาโพสต์ที่บันทึกไว้..."
            className="w-full rounded-3xl p-3 text-black placeholder-gray-600"
          />
        </div>
        <div className="flex gap-10 text-3xl mr-25">
          <button className="cursor-pointer">
            <BsBell />
          </button>
          <button className="cursor-pointer" onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Main Layout */}
      <div className="flex flex-1 w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <div className="flex flex-col gap-4">
            <button
              className="hover:bg-green-400 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/main-page")}
            >
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="bg-green-400 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/collect-post")}
            >
              บันทึก
            </button>
          </div>
          <button
            className="hover:bg-green-400 text-black rounded-3xl p-2 cursor-pointer"
            onClick={() => navigate("/setting")}
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col overflow-y-auto max-h-[calc(95.7vh-6rem)]">
          <div className="mb-6">
            <h2 className="text-xl font-bold mb-2">โพสต์ที่ถูกบันทึกของคุณ</h2>
            <div className="flex flex-wrap gap-3">
              {collections.length === 0 ? (
                <p className="text-gray-300">ยังไม่มีเพลย์ลิสต์</p>
              ) : (
                collections.map((c) => (
                  <div
                    key={c.id}
                    className="flex items-center gap-2 bg-gray-200 text-black px-4 py-2 rounded-full "
                  >
                    <button
                      onClick={() => {
                        setSelectedCollection(c);
                        fetchPostsInCollection(c.id);
                      }}
                      className={`font-semibold cursor-pointer ${
                        selectedCollection?.id === c.id
                          ? "text-green-600"
                          : "text-black"
                      }`}
                    >
                      {c.name}
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 cursor-pointer"
                      onClick={() => removeCollection(c.id)}
                    >
                      <BsTrash />
                    </button>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* โพสต์ในเพลย์ลิสต์ */}
          {selectedCollection ? (
            <>
              <h2 className="text-lg font-bold mb-4">
                📂 {selectedCollection.name}
              </h2>
              {message && <p className="text-green-400 mb-3">{message}</p>}
              {loading ? (
                <p>กำลังโหลด...</p>
              ) : posts.length === 0 ? (
                <p className="text-gray-300">ยังไม่มีโพสต์ที่ถูกบันทึก</p>
              ) : (
                <div className="flex flex-col gap-4">
                  {posts.map((post) => (
                    <div
                      key={post.id}
                      className="bg-white text-black rounded-lg p-4 shadow"
                    >
                      {/* Header */}
                      <div className="flex items-center justify-between pb-3 border-b border-gray-200">
                        <div className="flex items-center gap-3">
                          {post.profiles?.avatar_url ? (
                            <img
                              src={post.profiles.avatar_url}
                              alt="avatar"
                              className="w-10 h-10 rounded-full object-cover border border-gray-400"
                            />
                          ) : (
                            <BsPersonCircle size={36} className="text-gray-600" />
                          )}
                          <div className="flex flex-col">
                            <span className="font-semibold text-base">
                              {post.profiles?.username ||
                                post.profiles?.email ||
                                "ผู้ใช้งาน"}
                            </span>
                            <span className="text-xs text-gray-500">
                              {new Date(post.created_at).toLocaleString("th-TH")}
                            </span>
                          </div>
                        </div>
                        <div className="flex gap-3">
                          <button
                            className="text-green-600 hover:text-green-800 cursor-pointer"
                            onClick={() =>
                              addPostToCollection(selectedCollection.id, post.id)
                            }
                          >
                            <BsPlusCircle />
                          </button>
                          <button
                            className="text-red-600 hover:text-red-800 cursor-pointer"
                            onClick={() => removePostFromCollection(post.id)}
                          >
                            <BsTrash />
                          </button>
                        </div>
                      </div>

                      {/* Content */}
                      <p className="mt-2">{post.content}</p>

                      {/* ✅ Files */}
                      {(() => {
                        let filesArray = [];
                        try {
                          if (post.files) {
                            filesArray =
                              typeof post.files === "string"
                                ? JSON.parse(post.files)
                                : post.files;
                          }
                        } catch (err) {
                          console.error("Error parsing files:", err);
                        }

                        if (!Array.isArray(filesArray) || filesArray.length === 0)
                          return null;

                        return filesArray.map((f, idx) => (
                          <div key={idx} className="mt-3">
                            {f.url?.match(/\.(mp4|webm|ogg)$/i) ? (
                              <video
                                src={f.url}
                                controls
                                className="w-full rounded-lg"
                              />
                            ) : f.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                              <img
                                src={f.url}
                                alt={f.name || "file"}
                                className="w-full rounded-lg object-contain"
                              />
                            ) : (
                              <a
                                href={f.url}
                                download
                                className="flex items-center gap-2 px-3 py-1 bg-green-500 text-white rounded mt-2"
                              >
                                <BsDownload /> {f.name || "ดาวน์โหลดไฟล์"}
                              </a>
                            )}
                          </div>
                        ));
                      })()}
                    </div>
                  ))}
                </div>
              )}
            </>
          ) : (
            <p className="text-gray-300 mt-20 text-center">
               กรุณาเลือกเพลย์ลิสต์ด้านบนเพื่อดูโพสต์ที่บันทึกไว้
            </p>
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <AdCarousel />
        </div>
      </div>
    </div>
  );
}
