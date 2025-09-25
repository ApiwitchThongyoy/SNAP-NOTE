import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";

function SettingDetail() {
  return (
    <div className="p-4 bg-gray-800 text-white rounded">
      <h2 className="text-2xl mb-4">Setting Detail</h2>
      <div className="flex gap-4 text-xl">
        <BsBell />
        <BsPersonCircle />
        <FaRegHeart />
        <FaHeart />
        <FaRegBookmark />
        <FaRegComment />
      </div>
    </div>
  );
}

export default SettingDetail;