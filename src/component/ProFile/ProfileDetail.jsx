import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";




function Profile_Detail(){
  

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
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">หน้าหลัก</button>
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">โพสต์</button>
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">บันทึก</button>
        </div>

        <div className="absolute left-5 top-135 text-white">
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">ตั้งค่า</button>
        </div>
      </div>

    
      <div className="absolute left-85 top-30 bg-[#434343] w-280 h-149 flex flex-col justify-between text-2xl border rounded-md p-3">
        <div className="absolute left-5 top-5 bg-amber-50 w-270 h-139 flex flex-col justify-start text-2xl border rounded-lg p-3">
        <div className="flex items-start justify-between">
          <p>dkfjgthtrkl</p>
        </div>
        </div>
      </div>
    </div>
  );
}
export default Profile_Detail