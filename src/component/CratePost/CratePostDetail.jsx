import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import AdCarousel from "../Ads/AdsDetail";
import NotificationBell from "../NotificationBell/NotificationBell";


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
    if (handleFiles) handleFiles(updated);
  };

  return (
    <div>
      <label className="bg-gradient-to-r from-red-400 to-red-600 text-white px-6 py-3 rounded-full cursor-pointer hover:shadow-lg transition">
        เพิ่มไฟล์ หรือ วิดีโอ
        <input
          type="file"
          multiple
          accept="image/*,video/*" // ✅ เพิ่มตรงนี้ให้เลือกวิดีโอได้
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
                className="bg-red-500 text-white px-2 py-1 rounded text-xs hover:bg-red-600 cursor-pointer"
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

export default function CratePostDetail() {
  const navigate = useNavigate();
  const [postText, setPostText] = useState("");
  const [files, setFiles] = useState([]);
  const [user, setUser] = useState(null);

  const handleFiles = (newFiles) => setFiles(newFiles);

  const generateSafeFileName = (file) => {
    const ext = file.name.split(".").pop();
    return `${Date.now()}-${Math.floor(Math.random() * 100000)}.${ext}`;
  };


  useEffect(() => {
    const fetchUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (!error && data?.user) {
        setUser(data.user);
      }
    };
    fetchUser();
  }, []);

  const handleCreatePost = async () => {
    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser();

      if (userError || !user) {
        alert("กรุณาเข้าสู่ระบบก่อนโพสต์");
        return;
      }

      // ตรวจสอบโปรไฟล์
      const { data: existingUser } = await supabase
        .from("profiles")
        .select("id")
        .eq("id", user.id)
        .single();

      if (!existingUser) {
        await supabase.from("profiles").insert([
          {
            id: user.id,
            email: user.email,
            username: user.user_metadata?.username || user.email.split("@")[0],
            avatar_url: user.user_metadata?.avatar_url || null,
            bio: "",
          },
        ]);
      }

      const fileUrls = [];

      for (const file of files) {
        const fileName = generateSafeFileName(file);
        const filePath = `uploads/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from("post_files")
          .upload(filePath, file);

        if (uploadError) {
          console.error("Upload error:", uploadError);
          throw uploadError;
        }

        const { data: urlData } = supabase.storage
          .from("post_files")
          .getPublicUrl(filePath);

        fileUrls.push({
          url: urlData.publicUrl,
          name: file.name,
          type: file.type, // ✅ เก็บประเภทไฟล์ไว้ตรวจว่าเป็นภาพหรือวิดีโอ
        });
      }

      const { error: insertError } = await supabase.from("posts").insert([
        {
          content: postText,
          files: JSON.stringify(fileUrls),
          user_id: user.id,
        },
      ]);

      if (insertError) throw insertError;

      alert("โพสต์ถูกสร้างเรียบร้อยแล้ว!");
      navigate("/main-page");
    } catch (err) {
      console.error("❌ Error creating post:", err);
      alert("เกิดข้อผิดพลาดในการสร้างโพสต์");
    }
  };

  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700">
        <div className="flex-1 max-w-lg mx-auto bg-[#7CFF70] rounded-3xl px-4 py-2">
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full rounded-3xl p-3 text-black"
          />
        </div>
        <div className="flex gap-10 text-3xl mr-25">
          {user ? (
                      <NotificationBell userId={user.id} />
                    ) : (
                      <BsBell size={24} className="text-gray-500" />
                    )}
          <button
            className="cursor-pointer"
            onClick={() => navigate("/profile")}
          >
            <BsPersonCircle />
          </button>
        </div>
      </div>

      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl">
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          <div className="flex flex-col gap-6">
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
              className="hover:bg-green-400 text-black rounded-3xl p-2 cursor-pointer"
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

        <div className="w-3/5 bg-[#636363] p-6 rounded-xl cursor-pointer">
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
              className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 cursor-pointer shadow-blue-500/50 shadow-lg"
            >
              สร้างโพสต์
            </button>
          </div>
        </div>

        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <AdCarousel />
        </div>
      </div>
    </div>
  );
}
