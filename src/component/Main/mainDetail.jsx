import { useContext, useState } from "react";
import { PostContext } from "../../context/PostContext";
import {
  BsBell,
  BsPersonCircle,
  BsHeart,
  BsHeartFill,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";

export default function MainDetail() {
  const { posts, editPost, deletePost, toggleLike, toggleSave } =
    useContext(PostContext);
  const navigate = useNavigate();

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  const handleEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
    setEditFiles([]);
  };

  const handleSaveEdit = (index) => {
    editPost(index, {
      text: editText,
      files: editFiles.length > 0 ? editFiles : undefined,
    });
    setEditIndex(null);
    setEditText("");
    setEditFiles([]);
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
                  className="bg-white text-black rounded-lg p-4 shadow max-w-md w-full flex flex-col gap-3"
                >
                  {editIndex === index ? (
                    <div className="flex flex-col gap-2">
                      {/* Edit Text */}
                      <textarea
                        className="w-full border rounded p-2"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      {/* Edit Files */}
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setEditFiles([...e.target.files])}
                        className="text-sm"
                      />

                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded"
                          onClick={() => handleSaveEdit(index)}
                        >
                          บันทึก
                        </button>
                        <button
                          className="px-4 py-2 bg-gray-400 text-white rounded"
                          onClick={() => setEditIndex(null)}
                        >
                          ยกเลิก
                        </button>
                      </div>
                    </div>
                  ) : (
                    <>
                      {/* เนื้อหาโพสต์ */}
                      <p className="mb-2 text-base">{post.text}</p>

                      {/* แสดงไฟล์ + ปุ่มดาวน์โหลด */}
                      {post.files && post.files.length > 0 && (
                        <div className="flex gap-4 flex-wrap">
                          {post.files.map((file, i) =>
                            file.type.startsWith("image/") ? (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-2"
                              >
                                <img
                                  src={file.url}
                                  alt="uploaded"
                                  className="w-32 h-32 object-cover rounded"
                                />
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  ดาวน์โหลด
                                </a>
                              </div>
                            ) : (
                              <div
                                key={i}
                                className="flex flex-col items-center gap-2"
                              >
                                <span className="px-2 py-1 bg-gray-200 rounded text-sm">
                                  📄 {file.name}
                                </span>
                                <a
                                  href={file.url}
                                  download={file.name}
                                  className="text-sm px-2 py-1 bg-green-500 text-white rounded hover:bg-green-600"
                                >
                                  ดาวน์โหลด
                                </a>
                              </div>
                            )
                          )}
                        </div>
                      )}

                      {/* ปุ่มต่างๆ */}
                      <div className="flex items-center justify-between mt-2">
                        {/* Like + Save */}
                        <div className="flex gap-4 items-center">
                          <button
                            className="flex items-center gap-2 text-red-500"
                            onClick={() => toggleLike(index)}
                          >
                            {post.liked ? <BsHeartFill /> : <BsHeart />}
                            <span>{post.likes}</span>
                          </button>

                          <button
                            className="flex items-center gap-2 text-blue-500"
                            onClick={() => toggleSave(index)}
                          >
                            {post.saved ? <BsBookmarkFill /> : <BsBookmark />}
                            <span>{post.saved ? "บันทึกแล้ว" : "บันทึก"}</span>
                          </button>
                        </div>

                        {/* Edit + Delete */}
                        <div className="flex gap-2">
                          <button
                            className="px-3 py-1 bg-blue-500 text-white rounded"
                            onClick={() => handleEdit(index, post.text)}
                          >
                            แก้ไข
                          </button>
                          <button
                            className="px-3 py-1 bg-red-500 text-white rounded"
                            onClick={() => deletePost(index)}
                          >
                            ลบ
                          </button>
                        </div>
                      </div>
                    </>
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
