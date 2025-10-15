import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient"; // ← import client ที่ตั้งไว้แล้ว
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = useState("กำลังตรวจสอบลิงก์ยืนยันอีเมล...");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      // ดึงพารามิเตอร์จาก URL ที่ Supabase ส่งมา เช่น access_token
      const { error } = await supabase.auth.verifyOtp({
        type: "signup",
        token_hash: new URLSearchParams(window.location.hash.substring(1)).get("access_token"),
      });

      if (error) {
        setMessage("❌ ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
      } else {
        setMessage("✅ อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว!");
        setTimeout(() => navigate("/login"), 3000); // กลับไปหน้า login หลัง 3 วิ
      }
    }

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E9FFD8]">
      <div className="bg-white shadow-lg rounded-2xl p-10 text-center">
        <h1 className="text-3xl font-bold text-[#164C11] mb-4">
          Email Verification
        </h1>
        <p className="text-lg text-gray-700">{message}</p>
      </div>
    </div>
  );
}

export default VerifyEmail;
