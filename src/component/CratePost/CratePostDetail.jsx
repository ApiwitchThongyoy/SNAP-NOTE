import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { usePosts } from "../../context/usePosts";

// ✅ ปุ่มอัปโหลดไฟล์
function UploadButtons({ handleFiles }) {
  const [fileData, setFileData] = useState([]);
  

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFilesLocal = (files) => {
    const newFiles = [...fileData, ...files];
    setFileData(newFiles);
    if (handleFiles) handleFiles(newFiles);
  };

  const removeFile = (index) => {
    const updated = [...fileData];
    updated.splice(index, 1);
    setFileData(updated);
  };

  return (
    <div>
      <label className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full cursor-pointer hover:shadow-lg transition">
        ✨ เพิ่มไฟล์สวยๆ
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFilesLocal([...e.target.files])}
        />
      </label>

      {fileData.length > 0 && (
        <div className="mt-3 bg-gray-100 p-3 rounded">
          <h4 className="font-semibold mb-2">ไฟล์ที่เลือก:</h4>
          {fileData.map((file, index) => (
            <div
              key={index}
              className="flex justify-between items-center bg-white border rounded p-2 mb-2"
            >
              <span>
                {file.name} ({formatFileSize(file.size)})
              </span>
              <button
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
                onClick={() => removeFile(index)}
              >
                ลบ
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ✅ หน้า Create Post
function CratePostDetail() {
  const { addPost } = usePosts();
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState([]);

  const handleFiles = (newFiles) => setFiles(newFiles);

  const handleCreatePost = () => {
    addPost({ text: postText, files });
    navigate("/main-page");
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

      {/* Body Layout */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
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
        <div className="w-3/5 bg-[#636363] p-6 rounded-xl">
          <h2 className="text-xl font-bold mb-4">สร้างโพสต์</h2>

          <div className="bg-white text-black rounded-xl p-6">
            <UploadButtons handleFiles={handleFiles} />

            <textarea
              className="w-full h-32 mt-4 p-2 border rounded resize-none"
              placeholder="เขียนอะไรบางอย่าง..."
              value={postText}
              onChange={(e) => setPostText(e.target.value)}
            />

            <button
              onClick={handleCreatePost}
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
            >
              สร้างโพสต์
            </button>
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

export default CratePostDetail;
