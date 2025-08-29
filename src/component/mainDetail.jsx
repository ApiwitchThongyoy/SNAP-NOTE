import "../component/mainDetail.css";
import { BsBell } from "react-icons/bs";
import { BsPersonCircle } from "react-icons/bs";

function Main_Detail() {
  return (
    <div className="layout">

      
      <div className="icon-group">
        <BsBell size={30} />
        <BsPersonCircle size={35} />
      </div>

      <div className="search-bar">
        <input type="text" placeholder="ค้นหา" />
      </div>

  
      <div className="container">
        <button className="menu-item">หน้าหลัก</button>
        <button className="menu-item">โพสต์</button>
        <button className="menu-item">บันทึก</button>
        <button className="settings-btn">ตั้งค่า</button>
      </div>

      
      <div className="content">
        <p>เนื้อหาหลัก</p>
      </div>

   
      <div className="ad-sidebar">
        <h2>โฆษณา</h2>
      </div>

    </div>
  );
}

export default Main_Detail;
