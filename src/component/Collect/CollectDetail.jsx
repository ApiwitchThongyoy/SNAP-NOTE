import { useState, useEffect } from "react";
import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/usePosts";

// แปลงไฟล์เป็น Base64
const toBase64 = (url, type) =>
  fetch(url)
    .then((res) => res.blob())
    .then(
      (blob) =>
        new Promise((resolve, reject) => {
          const reader = new FileReader();
          reader.onloadend = () => resolve({ url: reader.result, type });
          reader.onerror = reject;
          reader.readAsDataURL(blob);
        })
    );

function Collect_Detail() {
  const navigate = useNavigate();
  const { posts, toggleSave } = usePosts();

  const [collections, setCollections] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [collectionName, setCollectionName] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [viewFile, setViewFile] = useState(null);

  // โหลดคอลเลคชันจาก localStorage
  useEffect(() => {
    const saved = localStorage.getItem("collections");
    if (saved) {
      try {
        setCollections(JSON.parse(saved));
      } catch {
        setCollections([]);
      }
    }
  }, []);

  // บันทึกคอลเลคชันเมื่อมีการเปลี่ยนแปลง
  useEffect(() => {
    localStorage.setItem("collections", JSON.stringify(collections));
  }, [collections]);

  // ✅ สร้างคอลเลคชันใหม่
  const handleCreateCollection = async () => {
    if (!collectionName.trim() || selectedPosts.length === 0) return;

    // แปลงไฟล์ในโพสต์ที่เลือกเป็น Base64
    const postsWithFiles = await Promise.all(
      posts
        .filter((p) => selectedPosts.includes(p.id))
        .map(async (p) => {
          const files = await Promise.all(
            p.files.map(async (f) => {
              if (f.url.startsWith("blob:")) {
                return await toBase64(f.url, f.type);
              }
              return f; // ถ้าเป็น URL ปกติ (จาก server) ไม่ต้องแปลง
            })
          );
          return { ...p, files };
        })
    );

    const newCollection = {
      id: Date.now(),
      name: collectionName,
      posts: postsWithFiles,
    };

    setCollections((prev) => [...prev, newCollection]);
    setCollectionName("");
    setSelectedPosts([]);
    setShowCreateModal(false);
  };

  // ✅ ลบคอลเลคชัน
  const handleDeleteCollection = (id) => {
    setCollections((prev) => prev.filter((c) => c.id !== id));
    setDeleteConfirm(null);
  };

  // ✅ เลือกโพสต์ตอนสร้างคอลเลคชัน
  const toggleSelectPost = (postId) => {
    setSelectedPosts((prev) =>
      prev.includes(postId)
        ? prev.filter((id) => id !== postId)
        : [...prev, postId]
    );
  };


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
          <button className="cursor-pointer">
            <BsBell />
          </button>
          <button className="cursor-pointer" onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body: Sidebar | Content | Ads */}
      <div className="flex flex-1 w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <div className="flex flex-col gap-6">
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/main-page")}
            >
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2 cursor-pointer"
              onClick={() => navigate("/collect-post")}
            >
              บันทึก
            </button>
          </div>
          <button
            className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2 cursor-pointer"
            onClick={() => navigate("/setting")}
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col overflow-y-auto max-h-[calc(95.7vh-6rem)]">
          {/* Collections */}
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">คอลเลคชันของคุณ</h2>
            <button
              className="bg-[#7CFF70] px-4 py-2 rounded-3xl text-black cursor-pointer"
              onClick={() => setShowCreateModal(true)}
            >
              สร้าง +
            </button>
          </div>

          <div className="flex flex-col gap-4">
            {collections.length === 0 ? (
              <p className="text-gray-300">ยังไม่มีคอลเลคชัน</p>
            ) : (
              collections.map((col) => (
                <div
                  key={col.id}
                  className="bg-white text-black p-4 rounded-xl flex flex-col gap-2"
                >
                  <div className="flex justify-between items-center">
                    <h3 className="font-bold">{col.name}</h3>
                    <button
                      className="text-red-500"
                      onClick={() =>
                        setDeleteConfirm({ type: "collection", id: col.id })
                      }
                    >
                      ❌ ลบ
                    </button>
                  </div>

                  {/* แสดงโพสต์ในคอลเลคชัน */}
                  <div className="grid grid-cols-2 gap-2">
                    {col.posts.map((post) => (
                      <div
                        key={post.id}
                        className="bg-gray-200 rounded p-2 flex flex-col items-center"
                      >
                        {post.files.length > 0 && (
                          <>
                            {post.files[0].type.startsWith("image/") ? (
                              <img
                                src={post.files[0].url}
                                alt=""
                                className="max-h-40 rounded cursor-pointer"
                                onClick={() => setViewFile(post.files[0])}
                              />
                            ) : post.files[0].type.startsWith("video/") ? (
                              <video
                                src={post.files[0].url}
                                controls
                                className="max-h-40 rounded cursor-pointer"
                                onClick={() => setViewFile(post.files[0])}
                              />
                            ) : (
                              <p
                                className="cursor-pointer underline"
                                onClick={() => setViewFile(post.files[0])}
                              >
                                {post.files[0].name}
                              </p>
                            )}
                          </>
                        )}
                        <p className="text-sm mt-2">{post.text}</p>
                        <button
                          className="text-red-500 mt-2 "
                          onClick={() => toggleSave(post.id)}>
                          ❌ ลบบันทึก
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Saved Posts ต้องแก้*/}
          <h2 className="text-xl font-bold mt-6">โพสต์ที่คุณบันทึก</h2>
          <div className="grid grid-cols-2 gap-4 mt-4">
            {posts
              .filter((p) => p.saved)
              .map((post) => (
                <div
                  key={post.id}
                  className="bg-white text-black rounded-xl p-4 flex flex-col"
                >
                  {post.files.map((file, fi) => (
                    <div key={fi} className="mb-2">
                      {file.type.startsWith("image/") ? (
                        <img
                          src={file.url}
                          alt=""
                          className="max-h-40 rounded cursor-pointer"
                          onClick={() => setViewFile(file)}
                        />
                      ) : file.type.startsWith("video/") ? (
                        <video
                          src={file.url}
                          controls
                          className="max-h-40 rounded cursor-pointer"
                          onClick={() => setViewFile(file)}
                        />
                      ) : (
                        <p
                          className="cursor-pointer underline"
                          onClick={() => setViewFile(file)}
                        >
                          {file.name}
                        </p>
                      )}
                    </div>
                  ))}
                  <p>{post.text}</p>
                  <button
                    className="text-red-500 mt-2 rounded-3xl p-2  hover:bg-red-200 active:bg-red-300 cursor-pointer"
                    onClick={() => toggleSave(post.id)}
                  >
                    ❌ ลบบันทึก
                  </button>
                </div>
              ))}
          </div>
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <h2>โฆษณา</h2>
        </div>
      </div>

      {/* Modal สร้างคอลเลคชัน */}
      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl w-[500px] text-black">
            <h2 className="text-lg font-bold mb-4">สร้างคอลเลคชันใหม่</h2>
            <input
              type="text"
              placeholder="ชื่อคอลเลคชัน"
              value={collectionName}
              onChange={(e) => setCollectionName(e.target.value)}
              className="border p-2 w-full rounded mb-4"
            />
            <div className="max-h-40 overflow-auto mb-4">
              {posts
                .filter((p) => p.saved)
                .map((post) => (
                  <label key={post.id} className="flex gap-2 items-center mb-2">
                    <input
                      type="checkbox"
                      checked={selectedPosts.includes(post.id)}
                      onChange={() => toggleSelectPost(post.id)}
                    />
                    <span>{post.text}</span>
                  </label>
                ))}
            </div>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-400 px-4 py-2 rounded"
                onClick={() => setShowCreateModal(false)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-green-500 px-4 py-2 rounded text-white"
                onClick={handleCreateCollection}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ยืนยันลบ */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-xl text-black">
            <p className="mb-4">คุณต้องการลบคอลเลคชันนี้ใช่หรือไม่?</p>
            <div className="flex gap-4 justify-end">
              <button
                className="bg-gray-400 px-4 py-2 rounded"
                onClick={() => setDeleteConfirm(null)}
              >
                ยกเลิก
              </button>
              <button
                className="bg-red-500 px-4 py-2 rounded text-white"
                onClick={() => handleDeleteCollection(deleteConfirm.id)}
              >
                ยืนยัน
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal ดูไฟล์ */}
      {viewFile && (
        <div
          className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
          onClick={() => setViewFile(null)}
        >
          <div
            className="bg-white p-4 rounded-xl max-w-3xl max-h-[80vh] overflow-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {viewFile.type.startsWith("image/") ? (
              <img
                src={viewFile.url}
                alt={viewFile.name}
                className="max-w-full max-h-[70vh] rounded"
              />
            ) : viewFile.type.startsWith("video/") ? (
              <video
                src={viewFile.url}
                controls
                className="max-w-full max-h-[70vh] rounded"
              />
            ) : (
              <p className="text-black">{viewFile.name}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default Collect_Detail;
