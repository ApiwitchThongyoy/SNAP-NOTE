import { useContext, useState, useEffect } from "react";
import { PostContext } from "../../context/PostContext";
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

export default function MainDetail() {
  const { posts, toggleLike, toggleSave } = useContext(PostContext);
  const navigate = useNavigate();

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

      {/* Body */}
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
          <h2 className="text-xl font-bold mb-4">โพสต์ล่าสุด</h2>

          {posts.length === 0 ? (
            <p className="text-gray-300">ยังไม่มีโพสต์</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white text-black rounded-lg p-4 shadow w-full flex flex-col gap-3"
                >
                  <div className="flex items-center gap-3 pb-3 border-b border-gray-200">
                    <BsPersonCircle size={40} className="text-gray-600" />
                    <div className="flex flex-col">
                      <span className="font-semibold text-base">
                        {post.author || "ผู้ใช้งาน"}
                      </span>
                      <span className="text-xs text-gray-500">
                        {post.timestamp || "เมื่อสักครู่"}
                      </span>
                    </div>
                  </div>

                  {/* เนื้อหาโพสต์ */}
                  <p className="mb-2 text-base">{post.text}</p>

                  {/* แสดงไฟล์ */}
                  {post.files && post.files.length > 0 && (
                    <div className="flex flex-col gap-4">
                      {post.files.map((file, i) =>
                        file.type.startsWith("image/") ? (
                          <div
                            key={i}
                            className="w-full bg-gray-100 rounded-lg overflow-hidden shadow-md"
                          >
                            <img
                              src={file.url}
                              alt={file.name}
                              className="w-full h-auto object-contain"
                            />
                            <div className="flex justify-between items-center p-2 bg-gray-200">
                              <span className="text-sm text-gray-600">
                                {file.name}
                              </span>
                              <a
                                href={file.url}
                                download={file.name}
                                className="text-green-600 hover:text-green-800"
                              >
                                <BsDownload size={20} />
                              </a>
                            </div>
                          </div>
                        ) : (
                          <div
                            key={i}
                            className="flex items-center justify-between p-3 bg-gray-200 rounded-lg shadow"
                          >
                            <span className="flex items-center gap-2 text-sm text-black">
                              📄 {file.name}
                            </span>
                            <a
                              href={file.url}
                              download={file.name}
                              className="px-3 py-1 bg-green-500 text-white rounded-lg hover:bg-green-600"
                            >
                              ดาวน์โหลด
                            </a>
                          </div>
                        )
                      )}
                    </div>
                  )}

                  {/* ปุ่ม Like, Save */}
                  <div className="flex gap-2 mt-2 flex-wrap">
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-red-500 text-white rounded hover:bg-red-600 cursor-pointer shadow-red-500/50 shadow-lg"
                      onClick={() => toggleLike(index)}
                    >
                      {post.liked ? <BsHeartFill /> : <BsHeart />} {post.likes}
                    </button>
                    <button
                      className="flex items-center gap-2 px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 cursor-pointer shadow-blue-500/50 shadow-lg"
                      onClick={() => toggleSave(index)}
                    >
                      {post.saved ? <BsBookmarkFill /> : <BsBookmark />}
                      {post.saved ? " บันทึกแล้ว" : " บันทึก"}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <AdCarousel/>
        </div>
      </div>
    </div>
  );
}
function AdCarousel() {
  const ads = [
   "src/assets/0tbi8w.jpg",
   "src/assets/1756624415_699135.png",
   "src/assets/document_7198_p8_20211012142423.jpg"
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % ads.length);
    }, 5000); // เปลี่ยนภาพทุก 3 วิ
    return () => clearInterval(interval);
  }, [ads.length]);

  return (
    <div className="relative w-full h-120 flex items-center justify-center">
      {/* รูปโฆษณา */}
      <img
        src={ads[currentIndex]}
        alt="ad"
        className="w-full h-full object-cover rounded-xl transition-all duration-700 ease-in-out"
      />

      {/* จุดแสดงสถานะภาพ */}
      <div className="absolute bottom-2 flex gap-2">
        {ads.map((_, i) => (
          <div
            key={i}
            className={`w-3 h-3 rounded-full transition-all ${
              i === currentIndex ? "bg-green-400" : "bg-gray-500"
            }`}
          ></div>
        ))}
      </div>
    </div>
  );
}
