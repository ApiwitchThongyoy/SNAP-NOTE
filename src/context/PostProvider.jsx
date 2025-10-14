// src/context/PostProvider.jsx
import { useState, useEffect } from "react";
import { PostContext } from "./PostContext";

function fileToBase64(file){
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = (error) => reject(error);
  });
}

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  // ✅ เพิ่มโพสต์ใหม่
  const addPost = async ({ text, files, author = "ผู้ใช้งาน" }) => {
    const filePromises = files.map(async(file) => ({
      name: file.name,
      url: await fileToBase64(file),
      type: file.type,
    }));
    const fileURLs = await Promise.all(filePromises);

    const newPost = {
      text,
      files: fileURLs,
      likes: 0,
      liked: false,   // ✅ ใช้ควบคุมกดถูกใจ/เลิกถูกใจ
      comments: [],
      saved: false,
      author: author,
      timestamp: new Date().toLocaleString('th-TH', { 
        year: 'numeric',
        month: 'short', 
        day: 'numeric',
        hour: '2-digit', 
        minute: '2-digit'
      })
    };

    setPosts((prev) => [...prev, newPost]);
  };

  // ✅ แก้ไขข้อความ + ไฟล์
  const editPost = (index, { text, files }) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index
          ? {
              ...post,
              text: text !== undefined ? text : post.text,
              files: files
                ? files.map((file) => ({
                    name: file.name,
                    url: URL.createObjectURL(file),
                    type: file.type,
                  }))
                : post.files,
            }
          : post
      )
    );
  };

  // ✅ ลบโพสต์
  const deletePost = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  // ✅ กดถูกใจ / เลิกถูกใจ
  const toggleLike = (index) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  // ✅ บันทึก/เลิกบันทึก
  const toggleSave = (index) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index ? { ...post, saved: !post.saved } : post
      )
    );
  };

  return (
    <PostContext.Provider
      value={{ posts, addPost, editPost, deletePost, toggleLike, toggleSave }}
    >
      {children}
    </PostContext.Provider>
  );
}
