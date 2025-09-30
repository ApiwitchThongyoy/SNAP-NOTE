import { BsBell, BsPersonCircle } from "react-icons/bs";
import { useNavigate } from "react-router-dom";

function Profile_likeDetail() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col h-screen w-screen bg-black text-white">
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
          <button onClick={() => navigate("/profile")}>
            <BsPersonCircle />
          </button>
        </div>
      </div>

      {/* Body */}
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
        <div className="w-3/5 bg-[#636363] overflow-y-auto p-6 rounded-xl">
          {/* Profile Info */}
          <div className="bg-[#434343] rounded-xl p-6 flex gap-6 items-center mb-6">
            <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-green-400">
              <img
                src="https://placekitten.com/200/200"
                alt="profile"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h2 className="font-bold text-lg">user_name</h2>
              <p className="text-sm">5 โพสต์</p>
              <p className="text-sm">about me.....</p>
            </div>
          </div>

          {/* Tabs */}
          <div className="bg-[#434343] rounded-xl p-6">
            <div className="flex gap-10 border-b border-gray-500 pb-2 mb-4">
              <button className="text-gray-300"
              onClick={() => navigate("/profile")}
              >
              โพสต์
              </button>
              <button className="border-b-2 border-green-500 font-semibold"
              onClick={() => navigate("/profile-like")}
              >
              ถูกใจ
              </button>
            </div>

            {/* Likes */}
            <div className="flex flex-col gap-4">
              <div className="bg-[#636363] rounded-lg p-4">ถูกใจ 1</div>
              <div className="bg-[#636363] rounded-lg p-4">ถูกใจ 2</div>
              <div className="bg-[#636363] rounded-lg p-4">ถูกใจ 3</div>
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

export default Profile_likeDetail;
