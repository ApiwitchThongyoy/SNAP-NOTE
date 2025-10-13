import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";

// SVG Component for the Back Arrow Icon to avoid import errors
function BackArrowIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"></path>
    </svg>
  );
}

// Placeholder for the Logo to avoid import errors
function PlaceholderLogo() {
    return (
        <div class=" left-0 top-0  h-full w-full"> 
        <img
          src={Logo_Login}
        alt="Snapnote Logo"
        className="w-full h-full"
        />
      </div>
    );
}

function SignUpDetail() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // ฟังก์ชันจำลองการขอ OTP
  function handleRequestOtp() {
    if (!email || !email.includes("@")) {
      alert("กรุณาใส่อีเมลที่ถูกต้อง");
      return;
    }
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`รหัส OTP ของคุณคือ: ${newOtp}`);
  }

  // ฟังก์ชันจัดการการส่งฟอร์มเพื่อบันทึกลงฐานข้อมูล
  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !email || !otp || !password || !confirmPassword) {
      return alert("กรุณากรอกข้อมูลทุกช่อง!");
    }
    if (otp !== generatedOtp) {
      return alert("OTP ไม่ถูกต้อง!");
    }
    if (password !== confirmPassword) {
      return alert("Passwords ไม่ตรงกัน!");
    }

    try {
      // ส่งข้อมูลไปยัง Backend API เพื่อบันทึกลงฐานข้อมูล
      const res = await fetch("http://localhost:5000/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, email, password }),
      });

      const data = await res.json();

      if (!res.ok) {
        return alert(`❌ ${data.message}`);
      }

      alert(`✅ ลงทะเบียนสำเร็จ! ข้อมูลถูกบันทึกลงฐานข้อมูลแล้ว`);
      navigate("/login");
    } catch (error) {
      console.error("Error:", error);
      alert("เกิดข้อผิดพลาดในการเชื่อมต่อเซิร์ฟเวอร์");
    }
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      <div className="absolute top-4 right-20 text-6xl text-[#164C11] cursor-pointer z-50">
        <button onClick={() => navigate(-1)} aria-label="Go back">
          <BackArrowIcon />
        </button>
      </div>
      <div className="absolute left-0 top-0 h-full hidden lg:block w-1/2">
        <PlaceholderLogo />
      </div>
      <div className="w-full lg:w-1/2 ml-auto p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-[#164C11]">Sign Up</h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            Username<br />
            <input type="text" value={username} onChange={(e) => setUsername(e.target.value)} placeholder="Enter your Username" required className="w-full max-w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]" />
          </div>
          <div>
            Email<br />
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Enter your Email" required className="w-full max-w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]" />
          </div>
          <div>
            <button type="button" onClick={handleRequestOtp} disabled={!email} className={`w-full max-w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-700 transition-colors font-bold mb-4 ${!email ? "cursor-not-allowed opacity-50" : ""}`}>
              รับรหัส OTP
            </button>
          </div>
          <div>
            OTP<br />
            <input type="text" value={otp} onChange={(e) => setOtp(e.target.value)} placeholder="Enter 6-digit OTP" maxLength={6} required className="w-full max-w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]" />
          </div>
          <div>
            Password<br />
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your Password" required className="w-full max-w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]" />
          </div>
          <div>
            Confirm Password<br />
            <input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Confirm your Password" required className="w-full max-w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]" />
          </div>
          <button type="submit" className="w-full max-w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-700 transition-colors cursor-pointer font-bold">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpDetail;

