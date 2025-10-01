import { useState } from "react";
import { PostContext } from "./PostContext";

export function PostProvider({ children }) {
  const [posts, setPosts] = useState([]);

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

  return (
    <PostContext.Provider value={{ posts, setPosts, addPost }}>
      {children}
    </PostContext.Provider>
  );
}
