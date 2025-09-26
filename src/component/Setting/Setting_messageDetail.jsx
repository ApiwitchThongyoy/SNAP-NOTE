import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";
import { useState } from "react";




function Setting_messageDetail() {
    const [followNotify, setFollowNotify] = useState(false);

  return (
    <div className="relative flex min-h-screen bg-[#000]">

 
      <div className="flex gap-10 text-white text-5xl absolute left-334 top-10 cursor-pointer">
        <BsBell onClick={() => {}} />
        <BsPersonCircle onClick={() => {}} />
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
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">โพสต์</button>
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">บันทึก</button>
        </div>

        <div className="absolute left-5 top-135 text-white">
          <button className="w-50 h-10 rounded-3xl hover:bg-green-400 active:bg-green-500 text-black cursor-pointer">ตั้งค่า</button>
        </div>
      </div>

    
      <div className="absolute left-85 top-30 bg-[#434343] w-280 h-149 flex flex-col justify-between text-2xl border rounded-md p-3">
        <div className="absolute left-5 top-5 bg-amber-50 w-120 h-139 flex flex-col justify-start text-2xl border rounded-lg p-3">
        <h1 className="text-black m-1">การตั้งค่า</h1>
        <h2 className="text-black m-2 break-words">บัญชี</h2>
        <button className="w-50 h-10 rounded-3xl hover:bg-gray-200 active:bg-gray-300cursor-pointer m-2.5 text-sm">ทั่วไป</button>
        <button className="w-50 h-10 rounded-3xl  hover:bg-gray-200 active:bg-gray-300 cursor-pointer m-2.5 text-sm">สลับบัญชี</button>
        <button className="w-50 h-10 rounded-3xl  hover:bg-gray-200  active:bg-gray-300 cursor-pointer m-2.5 text-sm">การเเจ้งเตือน</button>
        <button className=" w-50 h-10 rounded-3xl hover:bg-gray-200 active:bg-gray-300 cursor-pointer m-2.5 text-sm">ความเป็นส่วนตัว</button>
        <h2 className="text-black m-2 break-words">ความเป็นส่วนตัวเเละนโยบาย</h2>
        <button className="w-50 h-10 rounded-3xl hover:bg-gray-200 active:bg-gray-300 cursor-pointer m-2.5 text-sm">การเเจ้งเตือน</button>
        <button className="w-50 h-10 rounded-3xl hover:bg-gray-200 active:bg-gray-300 cursor-pointer m-2.5 text-sm">ความเป็นส่วนตัว</button>
        </div>
        <div className="absolute left-90 top-5 bg-amber-50 w-185 h-139 flex flex-col justify-start text-2xl border rounded-lg p-3">การติดตาม
          <p className="m-5 text-lg">เเจ้งให้ทราบเมื่อมีคนมาติดตาม</p>
          <div className="flex items-center gap-3 m-5">
            <span className="text-base text-black">ปิด</span>
            <button
              onClick={() => setFollowNotify(!followNotify)}
              className={`w-14 h-7 rounded-full flex items-center transition-colors duration-300 ${
                followNotify ? "bg-green-500" : "bg-gray-400"
              }`}
            >
              <div
                className={`w-6 h-6 bg-white rounded-full shadow-md transform transition-transform duration-300 ${
                  followNotify ? "translate-x-7" : "translate-x-0"
                }`}
              ></div>
            </button>
            <span className="text-base text-black">เปิด</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Setting_messageDetail;