import { useContext } from "react";
import { PostContext } from "../../context/PostContext";
import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function MainDetail() {
  const { posts } = useContext(PostContext);
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
          <button>
            <BsBell />
          </button>
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/main-page")}
            >
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/collect-post")}
            >
              บันทึก
            </button>
          </div>

          <button
            className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
            onClick={() => navigate("/setting")}
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#636363] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">โพสต์ล่าสุด</h2>

          {posts.length === 0 ? (
            <p className="text-gray-300">ยังไม่มีโพสต์</p>
          ) : (
            <div className="flex flex-col gap-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-white text-black rounded-xl p-4 shadow"
                >
                  <p className="mb-2">{post.text}</p>
                  {post.files && post.files.length > 0 && (
                    <div className="flex gap-2 flex-wrap">
                      {post.files.map((file, i) => {
                        if (file.type.startsWith("image/")) {
                          return (
                            <img
                              key={i}
                              src={file.url}
                              alt="uploaded"
                              className="w-32 h-32 object-cover rounded"
                            />
                          );
                        }
                        return (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-200 rounded text-sm"
                          >
                            📄 {file.name}
                          </span>
                        );
                      })}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <h2>โฆษณา</h2>
        </div>
      </div>
    </div>
  );
}
