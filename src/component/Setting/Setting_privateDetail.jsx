import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function Setting_privateDetail() {
  const [followNotify, setFollowNotify] = useState(false);
  const navigate = useNavigate();

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
          <button onClick={() => {}}>
            <BsBell />
          </button>
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body Layout */}
      <div className="flex flex-1 h-full w-full gap-6 px-6 py-4 text-2xl">
        {/* Sidebar */}
        <div className="w-1/5 bg-[#434343] flex flex-col justify-between p-6 rounded-xl">
          <div className="flex flex-col gap-6">
            <button className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
            onClick={() => navigate("/main-page")}
            >
              หน้าหลัก
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/crate-post")}
            >
              โพสต์
            </button>
            <button
              className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
              onClick={() => navigate("/collect-post")}
            >
              บันทึก
            </button>
          </div>
          <button
            className="hover:bg-green-400 active:bg-green-500 text-black rounded-3xl p-2"
            onClick={() => navigate("/setting")}
          >
            ตั้งค่า
          </button>
        </div>

        {/* Content */}
        <div className="w-3/5 bg-[#636363] p-6 rounded-xl flex gap-6">
          {/* Left Panel */}
          <div className="w-1/2 bg-amber-50 text-black rounded-lg p-4">
            <h1 className="font-bold text-xl mb-3">การตั้งค่า</h1>
            <h2 className="font-semibold text-xl mb-2">บัญชี</h2>
            <div className="flex flex-col gap-2">
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm"
              onClick={() => navigate("/setting")}
              >
                ทั่วไป
              </button>
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm"
              onClick={() => navigate("/settingaaccount")}
              >
                สลับบัญชี
              </button>
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm"
              onClick={() => navigate("/settingmessage")}
              >
                การแจ้งเตือน
              </button>
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm"
              onClick={() => navigate("")}
              >
                ความเป็นส่วนตัว
              </button>
            </div>
            <h2 className="font-semibold mt-4 mb-2">ความเป็นส่วนตัวและนโยบาย</h2>
            <div className="flex flex-col gap-2">
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm">
                การแจ้งเตือน
              </button>
              <button className="w-full rounded-3xl hover:bg-gray-200 active:bg-gray-300 p-2 text-sm">
                ความเป็นส่วนตัว
              </button>
            </div>
          </div>

          {/* Right Panel */}
          <div className="w-1/2 bg-amber-50 text-black rounded-lg p-4">
            <h2 className="font-bold text-lg mb-2">อนุญาตให้ผู้ใช้พูดถึงฉัน</h2>
            <p className="mb-5 text-lg">
              ทุกคนจะสามารถพูดถึงคุณในทุกโพสต์และความคิดเห็น
            </p>
            <div className="flex items-center gap-3 mb-5">
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

        {/* Ads */}
        <div className="w-1/5 bg-[#434343] p-6 flex items-center justify-center rounded-xl">
          <h2>โฆษณา</h2>
        </div>
      </div>
    </div>
  );
}

export default Setting_privateDetail;