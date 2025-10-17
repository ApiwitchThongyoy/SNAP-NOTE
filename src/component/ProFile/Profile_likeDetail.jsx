import { useContext,useState, useEffect } from "react";
import { PostContext } from "../../context/PostContext";
import {
  BsBell,
  BsPersonCircle,
  BsHeartFill,
  BsBookmark,
  BsBookmarkFill,
} from "react-icons/bs";
import { useNavigate } from "react-router-dom";
import AdCarousel from "../Ads/AdsDetail";

function Profile_likeDetail() {
  const navigate = useNavigate();
  const { posts, toggleLike, toggleSave } = useContext(PostContext);

  const user = JSON.parse(localStorage.getItem("user")) || {};
  const [aboutMe, setAboutMe] = useState("");
  const [profileImg] = useState(
    localStorage.getItem("profileImg") || "https://placekitten.com/200/200"
  );

  const handleAboutMeChange = (e) => {
    setAboutMe(e.target.value);
    localStorage.setItem("aboutMe", e.target.value);
  };


  useEffect(() => {
    const savedAbout = localStorage.getItem("aboutMe") || "";
    setAboutMe(savedAbout);
  }, []);

///✅ กรองเฉพาะโพสต์ที่กดถูกใจ
  const likedPosts = posts.filter((post) => post.liked);

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
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl ">
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
        <div className="w-3/5 bg-[#636363] overflow-y-auto p-6 rounded-xl sticky top-4 max-h-[calc(95.7vh-6rem)]">
          {/* Profile Info */}
          <div className="bg-[#434343] rounded-xl p-6 flex gap-6 items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400">
              <img
                src={profileImg}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">{user.username}</h2>
              <p className="text-sm">{likedPosts.length} ถูกใจ</p>
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
                className="text-gray-300 cursor-pointer"
                onClick={() => navigate("/profile")}
              >
                โพสต์
              </button>
              <button
                className="border-b-2 border-green-500 font-semibold cursor-pointer"
                onClick={() => navigate("/profile-like")}
              >
                ถูกใจ
              </button>
            </div>

            {/* Liked Posts */}
            <div className="flex flex-col gap-4">
              {likedPosts.length === 0 ? (
                <p className="text-gray-300">ยังไม่มีโพสต์ที่ถูกใจ</p>
              ) : (
                likedPosts.map((post, index) => (
                  <div
                    key={index}
                    className="bg-[#636363] rounded-lg p-4 flex flex-col gap-2"
                  >
                    <p>{post.text}</p>

                    {/* แสดงไฟล์ถ้ามี */}
                    {post.files && post.files.length > 0 && (
                      <div className="flex gap-4 flex-wrap">
                        {post.files.map((file, i) =>
                          file.type.startsWith("image/") ? (
                            <img
                              key={i}
                              src={file.url}
                              alt={file.name}
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

                    {/* ปุ่ม toggle */}
                    <div className="flex gap-2 mt-2">
                      <button
                        className="px-3 py-1 bg-red-500 text-white rounded cursor-pointer shadow-red-500/50 shadow-lg hover:bg-red-600"
                        onClick={() => toggleLike(posts.indexOf(post))}
                      >
                        <BsHeartFill /> {post.likes}
                      </button>
                      <button
                        className="px-3 py-1 bg-blue-500 text-white rounded cursor-pointer shadow-blue-500/50 shadow-lg hover:bg-blue-600"
                        onClick={() => toggleSave(posts.indexOf(post))}
                      >
                        {post.saved ? <BsBookmarkFill /> : <BsBookmark />}
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <AdCarousel/>
        </div>
      </div>
    </div>
  );
}

export default Profile_likeDetail;
