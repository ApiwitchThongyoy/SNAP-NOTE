import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";




function Collect_Detail() {
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
          <button className="bg-[#7CFF70] w-50 h-10 rounded-3xl text-black cursor-pointer">หน้าหลัก</button>
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">โพสต์</button>
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">บันทึก</button>
        </div>

        <div className="absolute left-5 top-135 text-white">
          <button className="w-50 h-10 rounded-3xl bg-black cursor-pointer">ตั้งค่า</button>
        </div>
      </div>

    
      <div className="absolute left-85 top-30 bg-[#434343] w-220 h-149 flex justify-between text-2xl  items-start border rounded p-3">
        <p className=" text-white top-35">คอลเเลคชั่นของคุณ</p>
        <button className="bg-[#7CFF70] lef-140 top-0 right-0 w-50 h-10 text-flex ml-auto rounded-3xl text-black cursor-pointer">สร้าง +</button>
      </div>


     
     
      <div className="absolute left-310 top-30 bg-[#434343] flex flex-col justify-between w-65 h-149 border rounded p-6 text-2xl items-center">
        <h2>โฆษณา</h2>
      </div>

    </div>
  );
}

export default Collect_Detail;