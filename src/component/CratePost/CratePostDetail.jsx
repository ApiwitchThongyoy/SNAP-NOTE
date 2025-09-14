import { BsBell, BsPersonCircle } from "react-icons/bs";
import { FaRegHeart, FaHeart, FaRegBookmark, FaRegComment } from "react-icons/fa";


function CratePostDetail() {
  return (
    <div className="relative flex min-h-screen bg-[#000]">

 
      <div className="flex gap-10 text-white text-5xl absolute left-334 top-14 cursor-pointer">
        <BsBell onClick={() => {}} />
        <BsPersonCircle onClick={() => {}} />
      </div>

      
      <div className="absolute left-145 top-14 bg-[#7077ff] w-90 h-10 rounded-3xl">
        <input
          type="text"
          placeholder="ค้นหา"
          className="w-full border rounded p-2"
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

    
      <div className="absolute left-85 top-30 bg-[#434343] w-220 h-140 flex flex-col justify-between text-2xl border rounded p-3">
        <div className="absolute left-10 top-5 items-center bg-white w-200 h-120 flex flex-col justify-between text-2xl border rounded p-3">
          <p>เนื้อหาหลัก</p>
        </div>
      </div>

   
      <div className="absolute left-95 top-135 bg-[#FDFF7E] w-200 h-30 flex flex-col justify-between text-2xl border rounded p-3">
        <h2>ชื่องาน:</h2>
        <br />
        <h2>ชื่อเจ้าของผลงาน:</h2>
      </div>


      <div className="flex gap-10 text-black text-2xl absolute left-250 top-140 cursor-pointer">
        <FaRegHeart  onClick={() => {}}/>
        <FaRegComment onClick={() => {}}/>
        <FaRegBookmark onClick={() => {}}/>
      </div>

     
      <div className="absolute left-310 top-30 bg-[#434343] flex flex-col justify-between w-65 h-145 border rounded p-6 text-2xl items-center">
        <h2>โฆษณา</h2>
      </div>

    </div>
  );
}

export default CratePostDetail;