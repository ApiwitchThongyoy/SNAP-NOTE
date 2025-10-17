import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import { supabase } from "../../supabaseClient";
import AdCarousel from "../Ads/AdsDetail";

function ProfileDetail() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState({});
  const [posts, setPosts] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [tab, setTab] = useState("myPosts");
  const [aboutMe, setAboutMe] = useState("");
  const [profileImg, setProfileImg] = useState("https://placekitten.com/200/200");
  const [editIndex, setEditIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFile, setEditFile] = useState(null);

  // ✅ โหลดข้อมูลเริ่มต้น
  useEffect(() => {
    const init = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      setUser(user);

      // โหลดข้อมูลโปรไฟล์
      const { data: profileData } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
        setAboutMe(profileData.bio || "");
        setProfileImg(profileData.avatar_url || "https://placekitten.com/200/200");
      }

      // โหลดโพสต์ของ user
      const { data: postsData } = await supabase
        .from("posts")
        .select("*")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      setPosts(postsData || []);

      // โหลดโพสต์ที่ถูกใจ
      const { data: likedData } = await supabase
        .from("likes")
        .select("post_id, posts(*)")
        .eq("user_id", user.id);

      if (likedData) {
        setLikedPosts(likedData.map((l) => l.posts));
      }
    };

    init();
  }, []);

  // ✅ ฟังก์ชันล้างชื่อไฟล์
  const sanitizeFileName = (name) => {
    return name
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .replace(/[^a-zA-Z0-9._-]/g, "_");
  };

  // ✅ เปลี่ยนรูปโปรไฟล์
  const handleProfileImgChange = async (e) => {
    const file = e.target.files[0];
    if (!file || !user) return;

    const safeFileName = sanitizeFileName(file.name);
    const fileName = `${user.id}-${Date.now()}-${safeFileName}`;
    const filePath = `${user.id}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from("profile_avatars")
      .upload(filePath, file, { cacheControl: "3600", upsert: true });

    if (uploadError) {
      console.error("Upload error:", uploadError);
      alert("❌ อัปโหลดรูปภาพไม่สำเร็จ");
      return;
    }

    const { data: urlData } = supabase.storage
      .from("profile_avatars")
      .getPublicUrl(filePath);

    const publicUrl = urlData.publicUrl;

    const { error: updateError } = await supabase
      .from("profiles")
      .update({ avatar_url: publicUrl })
      .eq("id", user.id);

    if (updateError) {
      console.error("Update avatar error:", updateError);
      alert("❌ บันทึกข้อมูลโปรไฟล์ไม่สำเร็จ");
      return;
    }

    setProfileImg(publicUrl);
    alert("✅ อัปโหลดรูปโปรไฟล์สำเร็จ!");
  };

  // ✅ อัปเดต bio
  const handleAboutMeChange = async (e) => {
    const value = e.target.value;
    setAboutMe(value);
    if (!user) return;
    await supabase.from("profiles").update({ bio: value }).eq("id", user.id);
  };

  // ✅ แก้ไขโพสต์
  const handleEdit = (index, content) => {
    setEditIndex(index);
    setEditText(content);
  };

  // ✅ อัปโหลดไฟล์ใหม่ตอนแก้ไข
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setEditFile(file);
  };

  // ✅ บันทึกโพสต์ที่แก้ไข
  const handleSaveEdit = async (postId) => {
    let fileUrl = null;

    if (editFile) {
      const safeFileName = sanitizeFileName(editFile.name);
      const fileName = `${user.id}-${Date.now()}-${safeFileName}`;
      const filePath = `${user.id}/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from("post_files")
        .upload(filePath, editFile, { cacheControl: "3600", upsert: true });

      if (uploadError) {
        console.error("File upload error:", uploadError);
        alert("❌ ไม่สามารถอัปโหลดไฟล์ได้");
        return;
      }

      const { data: urlData } = supabase.storage
        .from("post_files")
        .getPublicUrl(filePath);

      fileUrl = urlData.publicUrl;
    }

    const updateData = { content: editText };
    if (fileUrl) {
      updateData.files = JSON.stringify([{ url: fileUrl, name: editFile.name }]);
    }

    const { error } = await supabase
      .from("posts")
      .update(updateData)
      .eq("id", postId);

    if (!error) {
      setEditIndex(null);
      setEditText("");
      setEditFile(null);
      window.location.reload();
    }
  };

  // ✅ ลบโพสต์
  const handleDeletePost = async (postId) => {
    await supabase.from("posts").delete().eq("id", postId);
    setPosts(posts.filter((p) => p.id !== postId));
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
        <div className="flex gap-10 text-3xl mr-25">
          <BsBell />
          <BsPersonCircle
            onClick={() => navigate("/profile")}
            className="cursor-pointer"
          />
        </div>
      </div>

      {/* Layout */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button
              onClick={() => navigate("/main-page")}
              className="hover:bg-green-400 text-black rounded-3xl p-2"
            >
              หน้าหลัก
            </button>
            <button
              onClick={() => navigate("/crate-post")}
              className="hover:bg-green-400 text-black rounded-3xl p-2"
            >
              โพสต์
            </button>
            <button
              onClick={() => navigate("/collect-post")}
              className="hover:bg-green-400 text-black rounded-3xl p-2"
            >
              บันทึก
            </button>
          </div>
          <button
            onClick={() => navigate("/setting")}
            className="hover:bg-green-400 text-black rounded-3xl p-2"
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col overflow-y-auto">
          {/* Profile Info */}
          <div className="bg-[#434343] rounded-xl p-6 flex gap-6 items-center mb-6">
            <div className="flex flex-col items-center">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400">
                <img
                  src={profileImg}
                  alt="profile"
                  className="w-full h-full object-cover"
                />
              </div>
              <label className="mt-2 w-28 text-sm cursor-pointer text-center">
                แก้ไขรูปภาพ
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfileImgChange}
                />
              </label>
            </div>
            <div>
              <h2 className="font-bold text-lg">{profile.username}</h2>
              <p className="text-sm">{posts.length} โพสต์</p>
              <textarea
                className="text-black rounded p-2 mt-2 w-full"
                placeholder="about me....."
                value={aboutMe}
                onChange={handleAboutMeChange}
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex gap-10 border-b border-gray-500 pb-2 mb-4">
            <button
              className={`${
                tab === "myPosts"
                  ? "border-b-2 border-green-500 font-semibold"
                  : "text-gray-300"
              }`}
              onClick={() => setTab("myPosts")}
            >
              โพสต์ของฉัน
            </button>
            <button
              className={`${
                tab === "ProFile_like"
                  ? "border-b-2 border-green-500 font-semibold"
                  : "text-gray-300"
              }`}
              onClick={() => setTab("ProFile_like")}
            >
              ถูกใจ
            </button>
          </div>

          {/* แสดงโพสต์ */}
          {tab === "myPosts" ? (
            posts.length === 0 ? (
              <p className="text-center text-gray-400 mt-6">ยังไม่มีโพสต์ของคุณ</p>
            ) : (
              posts.map((post, index) => {
                let files = [];
                try {
                  if (typeof post.files === "string") {
                    files = JSON.parse(post.files);
                  } else if (Array.isArray(post.files)) {
                    files = post.files;
                  }
                } catch {
                  files = [];
                }

                return (
                  <div
                    key={post.id}
                    className="bg-[#636363] rounded-lg p-4 flex flex-col gap-2 mb-4"
                  >
                    {editIndex === index ? (
                      <>
                        <textarea
                          className="w-full border rounded p-2 text-black"
                          value={editText}
                          onChange={(e) => setEditText(e.target.value)}
                        />
                        <input
                          type="file"
                          onChange={handleFileChange}
                          className="mt-2"
                        />
                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleSaveEdit(post.id)}
                            className="px-4 py-2 bg-green-500 rounded"
                          >
                            บันทึก
                          </button>
                          <button
                            onClick={() => setEditIndex(null)}
                            className="px-4 py-2 bg-gray-500 rounded"
                          >
                            ยกเลิก
                          </button>
                        </div>
                      </>
                    ) : (
                      <>
                        <p>{post.content}</p>

                        {/* ✅ แสดงรูป/ไฟล์แนบ */}
                        {files.length > 0 && (
                          <div className="flex flex-wrap gap-3 mt-2">
                            {files.map((file, i) =>
                              file.url?.match(/\.(jpg|jpeg|png|gif|webp)$/i) ? (
                                <img
                                  key={i}
                                  src={file.url}
                                  alt={file.name}
                                  className="w-40 h-40 object-cover rounded-lg border border-gray-600"
                                />
                              ) : (
                                <a
                                  key={i}
                                  href={file.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-blue-300 underline"
                                >
                                  📎 {file.name}
                                </a>
                              )
                            )}
                          </div>
                        )}

                        <div className="flex gap-2 mt-2">
                          <button
                            onClick={() => handleEdit(index, post.content)}
                            className="px-3 py-1 bg-blue-500 rounded"
                          >
                            แก้ไข
                          </button>
                          <button
                            onClick={() => handleDeletePost(post.id)}
                            className="px-3 py-1 bg-red-500 rounded"
                          >
                            ลบ
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                );
              })
            )
          ) : likedPosts.length === 0 ? (
            <p className="text-center text-gray-400 mt-6">ยังไม่มีโพสต์ที่ถูกใจ</p>
          ) : (
            likedPosts.map((post) => (
              <div
                key={post.id}
                className="bg-[#636363] rounded-lg p-4 flex flex-col gap-2 mb-4"
              >
                <p>{post.content}</p>
              </div>
            ))
          )}
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <AdCarousel />
        </div>
      </div>
    </div>
  );
}

export default ProfileDetail;
