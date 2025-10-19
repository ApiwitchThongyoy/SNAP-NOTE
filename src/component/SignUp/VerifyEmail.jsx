import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = useState("กำลังตรวจสอบลิงก์ยืนยันอีเมล...");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      try {
        const hashParams = new URLSearchParams(window.location.hash.substring(1));
        const access_token = hashParams.get("access_token");
        const refresh_token = hashParams.get("refresh_token");
        // ✅ ตรวจสอบว่ามี token ไหม
        if (!access_token || !refresh_token) {
          setMessage("❌ ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
          return;
        }

        // ✅ ตั้ง session ใหม่ด้วย token ที่ได้จาก Supabase
        const { error } = await supabase.auth.setSession({
          access_token,
          refresh_token,
        });

        if (error) {
          console.error("Set session error:", error);
          setMessage("❌ ไม่สามารถเข้าสู่ระบบหลังยืนยันอีเมลได้");
          return;
        }

        // ✅ ตรวจสอบสถานะผู้ใช้หลังยืนยัน
        const { data: userData } = await supabase.auth.getUser();
        if (userData?.user?.email_confirmed_at) {
          setMessage("✅ อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          setMessage("❌ การยืนยันอีเมลไม่สำเร็จ");
        }
      } catch (err) {
        console.error("Unexpected error:", err);
        setMessage("❌ เกิดข้อผิดพลาดในการตรวจสอบอีเมล");
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
