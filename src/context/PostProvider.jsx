import { useState, useEffect } from "react";
import { PostContext } from "./PostContext";

export function PostProvider({ children }) {
  const [posts, setPosts] = useState(() => {
    const saved = localStorage.getItem("posts");
    return saved ? JSON.parse(saved) : [];
  });

  useEffect(() => {
    localStorage.setItem("posts", JSON.stringify(posts));
  }, [posts]);

  const addPost = ({ text, files }) => {
    const fileURLs = files.map((file) => ({
      name: file.name,
      url: URL.createObjectURL(file),
      type: file.type,
    }));

    const newPost = {
      text,
      files: fileURLs,
      likes: 0,
      comments: [],
      saved: false,
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

  const deletePost = (index) => {
    setPosts((prev) => prev.filter((_, i) => i !== index));
  };

  const toggleLike = (index) => {
    setPosts((prev) =>
      prev.map((post, i) =>
        i === index ? { ...post, likes: post.likes + 1 } : post
      )
    );
  };

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
