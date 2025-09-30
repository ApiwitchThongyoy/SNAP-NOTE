import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaBookmark, FaRegComment } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

function Main_Detail() {
  const navigate = useNavigate();

  // Mock post ตัวอย่าง
  const [posts] = useState([
    { id: 1, text: "วันนี้อากาศดี 🌤️", likes: 3, comments: ["จริงครับ", "ร้อนมาก!"], saved: false },
    { id: 2, text: "React สนุกมาก 🚀", likes: 10, comments: ["จริง!", "ใช่เลย"], saved: true },
  ]);

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700">
        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-auto bg-[#7CFF70] rounded-3xl px-4 py-2">
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full rounded-3xl p-3 text-black"
          />
        </div>

        {/* Icons */}
        <div className="flex gap-6 text-3xl">
          <button onClick={() => navigate()}>
            <BsBell />
          </button>
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body: Sidebar | Content | Ads */}
      {/* 🔥 จุดสำคัญ: เพิ่ม gap-6, px-6, py-4 เพื่อสร้างระยะห่างระหว่างกล่อง */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-4xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2">
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2 "
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
        <div className="w-3/5 bg-[#636363] overflow-y-auto p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">โพสต์ล่าสุด</h2>
          {posts.map((p) => (
            <div key={p.id} className="bg-white text-black rounded-xl p-4 mb-4">
              <p className="text-lg mb-2">📌 {p.text}</p>
              <div className="flex gap-6 text-xl">
                <span className="flex items-center gap-2">
                  <FaHeart className="text-red-500" /> {p.likes}
                </span>
                <span className="flex items-center gap-2">
                  <FaRegComment /> {p.comments.length}
                </span>
                <span className="flex items-center gap-2">
                  {p.saved ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
                </span>
              </div>
              <div className="mt-2 text-gray-700">
                {p.comments.map((c, i) => (
                  <p key={i} className="text-sm">💬 {c}</p>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <h2>โฆษณา</h2>
        </div>
      </div>
    </div>
  );
}

export default Main_Detail;
