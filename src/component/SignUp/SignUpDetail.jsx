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

    // 🧩 ตรวจสอบว่ากรอกครบทุกช่อง
    if (!username || !email || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง");
      return;
    }

    // 🧩 ตรวจสอบว่ารหัสผ่านตรงกันไหม
    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    try {
      // ✅ ตรวจสอบว่าอีเมลนี้มีอยู่ใน profiles แล้วหรือยัง
      const { data: existingProfiles, error: checkError } = await supabase
        .from("profiles")
        .select("email")
        .eq("email", email);

      if (checkError) {
        console.error("Database Check Error:", checkError.message);
        alert("เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
        return;
      }

      if (existingProfiles.length > 0) {
        alert("อีเมลนี้ถูกใช้งานแล้ว กรุณาใช้อีเมลอื่น");
        return;
      }

      // ✅ สมัครสมาชิกใหม่โดยไม่ต้องส่งอีเมลยืนยัน (ปิด SMTP ได้)
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { username },
          // ไม่ใช้ redirectTo เพราะเราไม่ต้องการ email verification
        },
      });

      if (error) {
        console.error("Signup Error:", error);
        alert("สมัครสมาชิกไม่สำเร็จ: " + error.message);
        return;
      }

      const user = data.user;
      if (!user) {
        alert("ไม่สามารถสร้างบัญชีได้ กรุณาลองใหม่อีกครั้ง");
        return;
      }

      // ✅ เพิ่มข้อมูลเข้า profiles หลังสมัครสำเร็จ
      const { error: insertError } = await supabase.from("profiles").insert([
        {
          id: user.id,
          username,
          email,
          bio: "EMPTY",
          avatar_url: "https://ncrwckupxlkyfsfkamcn.supabase.co/storage/v1/object/public/avatars/default.png",
          created_at: new Date(),
        },
      ]);

      if (insertError) {
        console.error("Insert Profile Error:", insertError.message);
        alert("สมัครสมาชิกสำเร็จ แต่ไม่สามารถบันทึกข้อมูลเพิ่มเติมได้");
      } else {
        alert("สมัครสมาชิกสำเร็จ 🎉");
      }

      // ล้างค่า input ทั้งหมด
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");

      // กลับไปหน้า login
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
        className="absolute top-4 right-20 text-6xl text-[#164C11] z-50"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeftCircleFill />
      </button>

      {/* โลโก้ด้านซ้าย */}
      <div className="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ฟอร์มสมัคร */}
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
