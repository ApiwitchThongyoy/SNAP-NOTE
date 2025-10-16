import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Logo_Login from "../../assets/Logo_Login.svg";
import { BsArrowLeftCircleFill } from "react-icons/bs";

function SignUpDetail() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

const handleSubmit = async (e) => {
  e.preventDefault();

  if (!username || !email || !password || !confirmPassword) {
    alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
    return;
  }

  if (password !== confirmPassword) {
    alert("รหัสผ่านไม่ตรงกัน");
    return;
  }

  // ✅ เช็กว่าอีเมลนี้มีอยู่แล้วในระบบไหม
  const { data: emailExists, error: checkError } = await supabase.rpc(
    "check_email_exists",
    { email_input: email }
  );

  if (checkError) {
    alert("เกิดข้อผิดพลาดระหว่างตรวจสอบอีเมล: " + checkError.message);
    return;
  }

  if (emailExists) {
    alert("อีเมลนี้ถูกใช้แล้ว กรุณาเข้าสู่ระบบแทน");
    return;
  }

  // ✅ สมัครสมาชิกใหม่
  const { error } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { username },
      emailRedirectTo: "http://localhost:5173/verify-email",
    },
  });

  if (error) {
    alert("สมัครสมาชิกไม่สำเร็จ: " + error.message);
    return;
  }

  alert("สมัครสมาชิกสำเร็จ! 🎉 โปรดยืนยันอีเมลก่อนเข้าสู่ระบบ");
  setUsername("");
  setEmail("");
  setPassword("");
  setConfirmPassword("");
  navigate("/");
};

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      <button
        className="absolute top-4 right-20 text-6xl text-[#164C11] z-50"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeftCircleFill />
      </button>

      <div className="absolute left-0 top-0 h-full">
        <img src={Logo_Login} alt="left-side" className="w-full h-full object-cover" />
      </div>

      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-[#164C11]">Sign Up</h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <input
            type="text"
            placeholder="Username"
            className="w-[550px] p-3 border rounded mb-4 bg-[#BDFFA7]"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            className="w-[550px] p-3 border rounded mb-4 bg-[#BDFFA7]"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-[550px] p-3 border rounded mb-4 bg-[#BDFFA7]"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <input
            type="password"
            placeholder="Confirm Password"
            className="w-[550px] p-3 border rounded mb-4 bg-[#BDFFA7]"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
          />

          <button
            type="submit"
            className="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 font-bold"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpDetail;
