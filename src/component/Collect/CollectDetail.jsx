import { BsBell, BsPersonCircle } from "react-icons/bs";

function Collect_Detail() {
  return (
    <div className="flex flex-col min-h-screen w-screen bg-black text-white">
      {/* Header */}
      <div className="flex items-center justify-between p-4 bg-black border-b border-gray-700">
        {/* Search bar */}
        <div className="flex-1 max-w-lg mx-auto bg-[#7CFF70] rounded-3xl px-4 py-2">
          <input
            type="text"
            placeholder="ค้นหา"
            className="w-full rounded-3xl p-3 text-black"
          />
        </div>

        {/* Icons */}
        <div className="flex gap-6 text-3xl">
          <button>
            <BsBell />
          </button>
          <button>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body: Sidebar | Content | Ads */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-4xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2">
              หน้าหลัก
            </button>
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2">
              โพสต์
            </button>
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2">
              บันทึก
            </button>
          </div>

          <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2">
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#434343] p-6 rounded-xl flex flex-col">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold">คอลเลคชันของคุณ</h2>
            <button className="bg-[#7CFF70] px-4 py-2 rounded-3xl text-black cursor-pointer">
              สร้าง +
            </button>
          </div>

          {/* Example collection list */}
          <div className="flex flex-col gap-4">
            <div className="bg-white text-black p-4 rounded-xl">
              📂 คอลเลคชัน A
            </div>
            <div className="bg-white text-black p-4 rounded-xl">
              📂 คอลเลคชัน B
            </div>
          </div>
        </div>

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <h2>โฆษณา</h2>
        </div>
      </div>
    </div>
  );
}

export default Collect_Detail;
