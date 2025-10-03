import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/usePosts";
import { useState, useEffect } from "react";

function Profile_Detail() {
  //ตัวอย่างในโปรไฟล์
  const user = JSON.parse(localStorage.getItem("user")) || {};
  //ดึงข้อมูล user จาก localStorage
  const [aboutMe, setAboutMe] = useState("");
  const navigate = useNavigate();
  const { posts, deletePost, editPost } = usePosts();

  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  // โหลด aboutMe จาก localStorage เมื่อ component mount
  useEffect(() => {
    const savedAbout = localStorage.getItem("aboutMe") || "";
    setAboutMe(savedAbout);
  }, []);

  // ฟังก์ชันบันทึก aboutMe
  const handleAboutMeChange = (e) => {
    setAboutMe(e.target.value);
    localStorage.setItem("aboutMe", e.target.value);
  };

  // กดแก้ไข
  const handleEdit = (index, text) => {
    setEditIndex(index);
    setEditText(text);
    setEditFiles([]);
  };

  // บันทึกการแก้ไข -> ใช้ editPost ทับโพสต์เดิม
  const handleSaveEdit = () => {
    editPost(editIndex, {
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
        <div className="w-3/5 bg-[#636363] overflow-y-auto p-6 rounded-xl">
          {/* Profile Info */}
          <div className="bg-[#434343] rounded-xl p-6 flex gap-6 items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400">
              <img
                src="https://placekitten.com/200/200"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.username}</h2>
              <p className="text-sm">{posts.length} โพสต์</p>
              <textarea
                className="text-black rounded p-2 mt-2 w-full focus:outline-none transition-all resize-none"
                placeholder="about me....."
                value={aboutMe}
                onChange={handleAboutMeChange}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#434343] rounded-xl p-6">
            <div className="flex gap-10 border-b border-gray-500 pb-2 mb-4">
              <button
                className="border-b-2 border-green-500 font-semibold"
                onClick={() => navigate("/profile")}
              >
                โพสต์
              </button>
              <button
                className="text-gray-300"
                onClick={() => navigate("/profile-like")}
              >
                ถูกใจ
              </button>
            </div>

            {/* Posts */}
            <div className="flex flex-col gap-4">
              {posts.map((post, index) => (
                <div
                  key={index}
                  className="bg-[#636363] rounded-lg p-4 flex flex-col gap-2"
                >
                  {editIndex === index ? (
                    <div className="flex flex-col gap-2">
                      {/* Edit text */}
                      <textarea
                        className="w-full border rounded p-2 text-black"
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                      />

                      {/* Edit files */}
                      <input
                        type="file"
                        multiple
                        onChange={(e) => setEditFiles([...e.target.files])}
                        className="text-sm"
                      />

                      <div className="flex gap-2 mt-2">
                        <button
                          className="px-4 py-2 bg-green-500 text-white rounded"
                          onClick={handleSaveEdit}
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
                      {/* Post text */}
                      <p className="mb-2">{post.text}</p>

                      {/* Show files */}
                      {post.files && post.files.length > 0 && (
                        <div className="flex gap-4 flex-wrap">
                          {post.files.map((file, i) =>
                            file.type.startsWith("image/") ? (
                              <img
                                key={i}
                                src={file.url}
                                alt="uploaded"
                                className="max-w-full h-auto rounded"
                              />
                            ) : (
                              <span
                                key={i}
                                className="px-2 py-1 bg-gray-200 rounded text-sm text-black"
                              >
                                📄 {file.name}
                              </span>
                            )
                          )}
                        </div>
                      )}

                      {/* Buttons */}
                      <div className="flex gap-2 mt-2">
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
                    </>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <h2>โฆษณา</h2>
        </div>
      </div>
    </div>
  );
}

export default Profile_Detail;
