import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { supabase } from "../../supabaseClient"; // ✅ เพิ่มการเชื่อมต่อ Supabase

function SignUpDetail() {
  const [username, setUsername] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  // ✅ ฟังก์ชันขอ OTP (จำลอง)
  function handleRequestOtp() {
    if (!email) {
      alert("กรุณากรอกอีเมลก่อนรับ OTP");
      return;
    }
    if (!email.includes("@")) {
      alert("กรุณาใส่อีเมลที่ถูกต้อง");
      return;
    }

    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);

    alert(`รหัส OTP ของคุณคือ: ${newOtp}`);
  }

  // ✅ ฟังก์ชันสมัครสมาชิก
  async function handleSubmit(e) {
    e.preventDefault();

    if (!username || !email || !otp || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลทุกช่อง!");
      return;
    }

    if (!email.includes("@")) {
      alert("กรุณาใส่อีเมลที่ถูกต้อง");
      return;
    }

    if (otp !== generatedOtp) {
      alert("OTP ไม่ถูกต้อง!");
      return;
    }

    if (password !== confirmPassword) {
      alert("Passwords ไม่ตรงกัน!");
      return;
    }

    // ✅ บันทึกข้อมูลลง Supabase
    const { data, error } = await supabase
      .from("users")
      .insert([
        {
          username: username,
          email: email,
          password: password,
        },
      ]);

    if (error) {
      console.error(error);
      alert("เกิดข้อผิดพลาดในการสมัครสมาชิก!");
      return;
    }
    console.log("สมัครสมาชิกสำเร็จ!\nUsername: ${username}\nEmail: ${email}", data);

    // ✅ ล้างค่า input
    setUsername("");
    setEmail("");
    setOtp("");
    setPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");

    navigate("/");
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      <div>
        <button
          className="absolute top-4 right-20 text-6xl text-[#164C11] cursor-pointer z-50"
          onClick={() => navigate(-1)}
        >
          <BsArrowLeftCircleFill />
        </button>
      </div>

      <div className="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-[#164C11]">
          Sign Up
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            Username<br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your Email"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleRequestOtp}
              disabled={!email}
              className={`w-[550px] bg-[#164C11] text-white py-3 rounded font-bold mb-4 transition-colors ${
                !email
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-green-600"
              }`}
            >
              รับรหัส OTP
            </button>
          </div>

          <div>
            OTP<br />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            Password<br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            Confirm Password<br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your Password"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <button
            type="submit"
            className="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 transition-colors cursor-pointer font-bold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpDetail;
