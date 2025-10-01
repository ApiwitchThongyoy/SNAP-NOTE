import { useContext, useState } from "react";
import { PostContext } from "./PostContext";

export default function PostList() {
  const { posts, editPost, deletePost, toggleLike, toggleSave } =
    useContext(PostContext);

  const [editingIndex, setEditingIndex] = useState(null);
  const [editText, setEditText] = useState("");
  const [editFiles, setEditFiles] = useState([]);

  const handleSaveEdit = (index) => {
    editPost(index, { text: editText, files: editFiles.length > 0 ? editFiles : undefined });
    setEditingIndex(null);
    setEditText("");
    setEditFiles([]);
  };

  return (
    <div className="space-y-4 p-4">
      {posts.map((post, index) => (
        <div key={index} className="p-4 border rounded-lg shadow bg-white">
          {editingIndex === index ? (
            <div className="space-y-2">
              <textarea
                className="w-full border rounded p-2"
                value={editText}
                onChange={(e) => setEditText(e.target.value)}
              />
              <input
                type="file"
                multiple
                onChange={(e) => setEditFiles([...e.target.files])}
              />
              <div className="flex gap-2 mt-2">
                <button
                  className="bg-green-500 text-white px-3 py-1 rounded"
                  onClick={() => handleSaveEdit(index)}
                >
                  Save
                </button>
                <button
                  className="bg-gray-400 text-white px-3 py-1 rounded"
                  onClick={() => setEditingIndex(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="mb-2">{post.text}</p>
              {post.files.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-2">
                  {post.files.map((file, i) =>
                    file.type.startsWith("image/") ? (
                      <img
                        key={i}
                        src={file.url}
                        alt={file.name}
                        className="w-24 h-24 object-cover rounded"
                      />
                    ) : (
                      <a
                        key={i}
                        href={file.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-600 underline"
                      >
                        {file.name}
                      </a>
                    )
                  )}
                </div>
              )}
              <div className="flex gap-3 mt-2">
                <button
                  className="text-blue-600"
                  onClick={() => toggleLike(index)}
                >
                  👍 {post.likes}
                </button>
                <button
                  className="text-green-600"
                  onClick={() => toggleSave(index)}
                >
                  {post.saved ? "💾 Saved" : "Save"}
                </button>
                <button
                  className="text-yellow-600"
                  onClick={() => {
                    setEditingIndex(index);
                    setEditText(post.text);
                  }}
                >
                  ✏️ Edit
                </button>
                <button
                  className="text-red-600"
                  onClick={() => deletePost(index)}
                >
                  🗑 Delete
                </button>
              </div>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
