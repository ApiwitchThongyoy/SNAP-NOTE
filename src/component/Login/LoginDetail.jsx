import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";
import { supabase } from "../../supabaseClient";

function LoginDetail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }

    try {
      setLoading(true);

      // ✅ เข้าสู่ระบบผ่าน Supabase Auth
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert("เข้าสู่ระบบไม่สำเร็จ ❌: " + error.message);
        return;
      }

      // ✅ ถ้าสำเร็จ จะมี session และข้อมูล user
      console.log("User:", data.user);
      alert("เข้าสู่ระบบสำเร็จ 🎉");
      navigate("/main-page");
    } catch (err) {
      console.error("Login Error:", err.message);
      alert("เกิดข้อผิดพลาด: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      {/* ด้านซ้ายเป็นรูปภาพ */}
      <div className="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ด้านขวาเป็นฟอร์ม */}
      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-[#164C11]">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your E-mail"
            required
            className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <label className="mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your Password"
            required
            className="w-[550px] p-4 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          {/* ลิงก์ไปยังหน้า Sign Up / Reset Password */}
          <div className="flex flex-row gap-95 text-sm mb-6 ">
            <span
              className="text-[#000000] cursor-pointer hover:underline"
              onClick={() => navigate("/sign-up")}
            >
              Sign up?
            </span>
            <span
              className="text-[#000000] cursor-pointer hover:underline"
              onClick={() => navigate("/reset-password")}
            >
              Forget Password?
            </span>
          </div>

          {/* ปุ่ม Sign in */}
          <button
            type="submit"
            disabled={loading}
            className={`w-[550px] bg-[#164C11] text-white py-3 rounded font-bold transition-colors ${
              loading ? "opacity-50 cursor-not-allowed" : "hover:bg-green-600"
            }`}
          >
            {loading ? "กำลังเข้าสู่ระบบ..." : "Sign in"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginDetail; //
