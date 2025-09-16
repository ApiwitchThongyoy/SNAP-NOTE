import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function UploadButtons({ handleFiles }) {
  const [fileData, setFileData] = useState({
    fileList1: [],
    fileList2: [],
    fileList3: [],
    imageList: [],
  });

  const formatFileSize = (bytes) => {
    if (bytes === 0) return "0 Bytes";
    const k = 1024;
    const sizes = ["Bytes", "KB", "MB", "GB"];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
  };

  const handleFilesLocal = (files, listId) => {
    const newFiles = [...fileData[listId], ...files];
    setFileData((prev) => ({ ...prev, [listId]: newFiles }));
    if (handleFiles) handleFiles(newFiles, listId);
  };

  const removeFile = (listId, index) => {
    const updatedFiles = [...fileData[listId]];
    updatedFiles.splice(index, 1);
    setFileData((prev) => ({ ...prev, [listId]: updatedFiles }));
  };

  const renderFileList = (files, listId, isImage = false) => {
    if (files.length === 0) return null;
  return (
      <div className="mt-3 bg-gray-100 p-3 rounded">
        <h4 className="font-semibold mb-2">
          {isImage ? "รูปภาพที่เลือก:" : "ไฟล์ที่เลือก:"}
        </h4>
        {files.map((file, index) => (
          <div
            key={index}
            className="flex justify-between items-center bg-white border rounded p-2 mb-2"
          >
            <div className="flex items-center gap-2">
              {isImage && (
                <img
                  src={URL.createObjectURL(file)}
                  alt="preview"
                  className="w-12 h-12 object-cover rounded"
                />
              )}
              <span>
                {file.name} ({formatFileSize(file.size)})
              </span>
            </div>
            <button
              className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600"
              onClick={() => removeFile(listId, index)}
            >
              ลบ
            </button>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div>
      <label className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full cursor-pointer hover:shadow-lg transition">
        ✨ เพิ่มไฟล์สวยๆ
        <input
          type="file"
          multiple
          className="hidden"
          onChange={(e) => handleFilesLocal([...e.target.files], "fileList3")}
        />
      </label>

      {renderFileList(fileData.fileList3, "fileList3")}
    </div>
  );
}
    

  
function CratePostDetail() {


  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState([]);

  const handleFiles = (newFiles) => {
    setFiles(newFiles);
  };

  const handleCreatePost = () => {
  navigate("/main-page", {
    state: {
      text: postText,
      files: files,
    },
  });
  };

  return (
    <div className="relative flex min-h-screen bg-[#000]">

 
      <div className="flex gap-10 text-white text-5xl absolute left-334 top-10 cursor-pointer">
        <BsBell onClick={() => {}} />
        <BsPersonCircle onClick={() => {}} />
      </div>

      
      <div className="absolute left-130 top-10 bg-[#7077ff] w-120 h-15 rounded-3xl">
        <input
          type="text"
          placeholder="ค้นหา"
          className="w-full border rounded-3xl p-4.5"
        />
      </div>

      
      <div className="absolute left-20 top-30 bg-[#434343] flex flex-col justify-between w-60 h-149 border rounded p-6 text-2xl">
        <div className="flex flex-col gap-10 text-white">
          <button className="bg-[#7CFF70] w-50 h-10 rounded-3xl text-black cursor-pointer">หน้าหลัก</button>
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">โพสต์</button>
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">บันทึก</button>
        </div>

        <div className="absolute left-5 top-135 text-white">
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">ตั้งค่า</button>
        </div>
      </div>

    
      <div className="absolute left-85 top-30 bg-[#434343] w-280 h-149 flex flex-col justify-between text-2xl border rounded-md p-3">
        <div className="absolute left-5 top-5 bg-amber-50 w-190 h-139 flex flex-col justify-around text-2xl border rounded-lg p-3">
          <UploadButtons handleFiles={handleFiles} />
        </div>
        <div className="absolute left-200 top-5 bg-amber-50 w-75 h-68 flex flex-col justify-around text-2xl border rounded-lg p-3">
           <textarea
            className="w-full h-24 p-2 border rounded resize-none"
            placeholder="เขียนอะไรบางอย่าง..."
            value={postText}
            onChange={(e) => setPostText(e.target.value)}
          />
        </div>
        <div className="absolute left-200 top-75.5 bg-amber-50 w-75 h-68 flex flex-col justify-around text-2xl border rounded-lg p-3">
          <button
            onClick={handleCreatePost}
            className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600"
          >
            สร้างโพสต์
          </button>
        </div>
      </div>  
    </div>
  );
}

export default CratePostDetail