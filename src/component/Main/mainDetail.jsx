import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";





function Main_Detail() {

  const location = useLocation();
  const newPost = location.state;
  const navigate = useNavigate();
  
  
  const [posts, setPosts] = useState([
  ]);

 

  // state ของแต่ละโพสต์
  const [likes, setLikes] = useState(Array(posts.length).fill(0));
  const [liked, setLiked] = useState(Array(posts.length).fill(false));
  const [saved, setSaved] = useState(Array(posts.length).fill(false));
  const [comments, setComments] = useState(Array(posts.length).fill([]));
  const [commentText, setCommentText] = useState(Array(posts.length).fill(""));
  const [showComments, setShowComments] = useState(Array(posts.length).fill(false));

  useEffect(() => {
    if (newPost) {
      setPosts((prev) => [newPost, ...prev]); // เพิ่มโพสต์ใหม่ด้านบน
      setLikes((prev) => [0, ...prev]);
      setLiked((prev) => [false, ...prev]);
      setSaved((prev) => [false, ...prev]);
      setComments((prev) => [[], ...prev]);
      setCommentText((prev) => ["", ...prev]);
      setShowComments((prev) => [false, ...prev]);
    }
  }, [newPost]);
  // ฟังก์ชันกด Like
  const toggleLike = (index) => {
    const newLikes = [...likes];
    const newLiked = [...liked];
    if (newLiked[index]) {
      newLikes[index] -= 1;
    } else {
      newLikes[index] += 1;
    }
    newLiked[index] = !newLiked[index];
    setLikes(newLikes);
    setLiked(newLiked);
  };

  // ฟังก์ชันกด Save
  const toggleSave = (index) => {
    const newSaved = [...saved];
    newSaved[index] = !newSaved[index];
    setSaved(newSaved);
  };

  // ฟังก์ชันกดแสดง/ซ่อนคอมเมนต์
  const toggleComments = (index) => {
    const newShow = [...showComments];
    newShow[index] = !newShow[index];
    setShowComments(newShow);
  };

  // ฟังก์ชันเพิ่มคอมเมนต์
  const handleAddComment = (index) => {
    if (commentText[index].trim() !== "") {
      const newComments = [...comments];
      newComments[index] = [...newComments[index], commentText[index]];

      const newText = [...commentText];
      newText[index] = "";

      setComments(newComments);
      setCommentText(newText);
    }
  };

  


  return (
    <div className="relative flex min-h-screen bg-[#000]">

 
      <div>
        <button 
        type="button"
        className="flex gap-10 text-white text-5xl absolute left-334 top-10 cursor-pointer"
        onClick={() => navigate()}>
          <BsBell />
        </button>

        <button 
        type="button"
        className="flex gap-10 text-white text-5xl absolute left-356 top-10 cursor-pointer"
        onClick={() => navigate("/profile")}>
          <BsPersonCircle />
        </button>
        
      </div>

      
      <div className="absolute left-130 top-10 bg-[#7CFF70] w-120 h-15 rounded-3xl">
        <input
          type="text"
          placeholder="ค้นหา"
          className="w-full border rounded-3xl p-4.5"
        />
      </div>

      
      <div className="absolute left-20 top-30 bg-[#434343] flex flex-col justify-between w-60 h-149 border rounded p-6 text-2xl">
        <div className="flex flex-col gap-10 text-white">
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">หน้าหลัก</button>
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer"
          onClick={() => navigate("/crate-post")}
          >
          โพสต์
          </button>
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer"
          onClick={() => navigate("/collect-post")}
          >
          บันทึก
          </button>
        </div>

        <div className="absolute left-5 top-135 text-white">
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer"
          onClick={() => navigate("/setting")}
          >
          ตั้งค่า
          </button>
        </div>
      </div>

ื      <div className="absolute left-85 top-30 bg-[#434343] w-220 h-149 flex flex-col border rounded p-3 overflow-y-auto">
        {posts.map((p, index) => (
          <div
            key={index}
            className="bg-white w-full min-h-139 flex flex-col border rounded p-3 mb-4"
          >
            {/* ข้อความ */}
            <p className="text-black font-semibold">📌 {p.text}</p>

            {/* รูปภาพ */}
            <div className="flex gap-4 flex-wrap mt-3">
              {p.files?.map((file, i) => (
                <img
                  key={i}
                  src={URL.createObjectURL(file)}
                  alt="uploaded"
                  className="w-40 h-40 object-cover rounded"
                />
              ))}
            </div>

            {/* ปุ่ม Action */}
            <div className="flex gap-8 items-center mt-4 text-2xl text-gray-700">
              {/* Like */}
              <button onClick={() => toggleLike(index)} className="flex items-center gap-2 hover:text-red-500">
                {liked[index] ? <FaHeart className="text-red-500" /> : <FaRegHeart />}
                <span className="text-base">{likes[index]}</span>
              </button>

              {/* Comment */}
              <button onClick={() => toggleComments(index)} className="flex items-center gap-2 hover:text-blue-500">
                <FaRegComment />
                <span className="text-base">{comments[index].length}</span>
              </button>

              {/* Save */}
              <button onClick={() => toggleSave(index)} className="hover:text-yellow-500">
                {saved[index] ? <FaBookmark className="text-yellow-500" /> : <FaRegBookmark />}
              </button>
            </div>

            {/* ส่วนคอมเมนต์ */}
            {showComments[index] && (
              <div className="mt-4">
                {/* กล่องพิมพ์คอมเมนต์ */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    className="flex-1 border rounded p-2 text-base"
                    placeholder="เขียนคอมเมนต์..."
                    value={commentText[index]}
                    onChange={(e) => {
                      const newText = [...commentText];
                      newText[index] = e.target.value;
                      setCommentText(newText);
                    }}
                  />
                  <button
                    onClick={() => handleAddComment(index)}
                    className="bg-blue-500 text-white px-4 rounded hover:bg-blue-600 text-base"
                  >
                    ส่ง
                  </button>
                </div>

                {/* แสดงคอมเมนต์ */}
                <div className="mt-3">
                  {comments[index].length > 0 ? (
                    comments[index].map((c, i) => (
                      <p key={i} className="text-black text-base border-b py-1">
                        💬 {c}
                      </p>
                    ))
                  ) : (
                    <p className="text-gray-500 text-base">ยังไม่มีคอมเมนต์</p>
                  )}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>
      
  

     
      <div className="absolute left-310 top-30 bg-[#434343] flex flex-col justify-between w-65 h-149 border rounded p-6 text-2xl items-center">
        <h2>โฆษณา</h2>
      </div>

    </div>
  );
}

export default Main_Detail;
