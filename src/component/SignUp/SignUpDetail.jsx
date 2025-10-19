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

    try {
      // 🔹 ตรวจสอบว่าอีเมลมีอยู่ใน profiles แล้วหรือยัง
      const { data: existingUser, error: userCheckError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email)
        .maybeSingle();

      if (userCheckError) {
        console.error("Database Check Error:", userCheckError.message);
        alert("เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
        return;
      }

      if (existingUser) {
        alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
        return;
      }

      // ✅ สมัครสมาชิกใหม่ (Supabase จะส่งอีเมลยืนยันไปให้)
      const { data: _signUpData, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          emailRedirectTo: window.location.origin + "/verify-email",
        },
      });

      if (signUpError) {
        console.error("Signup Error:", signUpError.message);
        alert("สมัครสมาชิกไม่สำเร็จ: " + signUpError.message);
        return;
      }

      // 🔹 แจ้งผู้ใช้ให้ตรวจสอบอีเมล
      alert("สมัครสมาชิกสำเร็จ! 🎉 กรุณาตรวจสอบอีเมลของคุณเพื่อยืนยันก่อนเข้าสู่ระบบ");
      navigate("/");

      // ✅ เคลียร์ฟอร์ม
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // ✅ ส่งผู้ใช้ไปหน้า Login
      navigate("/");
    } catch (err) {
      console.error("Unexpected Error:", err);
      alert("เกิดข้อผิดพลาดในระบบ: " + err.message);
    }
  };

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      {/* ปุ่มย้อนกลับ */}
      <button
        className="absolute top-4 right-20 text-6xl text-[#164C11] z-50 cursor-pointer"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeftCircleFill />
      </button>

      {/* รูปฝั่งซ้าย */}
      <div className="absolute left-0 top-0 h-full">
        <img src={Logo_Login} alt="left-side" className="w-full h-full object-cover" />
      </div>

      {/* ส่วนฟอร์ม */}
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
            className="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 font-bold cursor-pointer"
          >
            Sign Up
          </button>
        </form>
      </div>
    </div>
  );
}

export default SignUpDetail;
