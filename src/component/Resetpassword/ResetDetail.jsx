import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";
import { BsArrowLeftCircleFill } from "react-icons/bs";
import { supabase } from "../../supabaseClient";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [isSending, setIsSending] = useState(false);
  const navigate = useNavigate();

  async function handleResetRequest(e) {
    e.preventDefault();

    if (!email.includes("@")) {
      alert("กรุณากรอกอีเมลให้ถูกต้อง (ต้องมี @)");
      return;
    }

    setIsSending(true);

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: "http://localhost:5173/update-password", // หน้าที่ให้ผู้ใช้ตั้งรหัสใหม่
    });

    setIsSending(false);

    if (error) {
      alert("ไม่สามารถส่งลิงก์รีเซ็ตรหัสผ่านได้: " + error.message);
    } else {
      alert("ส่งลิงก์รีเซ็ตรหัสผ่านไปยังอีเมลของคุณแล้ว");
      navigate("/");
    }
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      <button
        type="button"
        className="absolute top-4 right-20 text-6xl text-[#164C11] cursor-pointer z-50"
        onClick={() => navigate("/")}
      >
        <BsArrowLeftCircleFill />
      </button>

      <div className="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-[#164C11]">
          Reset Password
        </h1>

        <form onSubmit={handleResetRequest} className="flex flex-col">
          <label className="mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your E-mail"
            required
            className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <button
            type="submit"
            disabled={isSending}
            className={`w-[550px] bg-[#164C11] text-white py-3 rounded font-bold transition-colors ${
              isSending
                ? "opacity-50 cursor-not-allowed"
                : "hover:bg-green-600 cursor-pointer"
            }`}
          >
            {isSending ? "กำลังส่ง..." : "ส่งลิงก์รีเซ็ตรหัสผ่าน"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
