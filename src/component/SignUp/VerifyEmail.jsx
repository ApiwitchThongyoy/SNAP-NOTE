import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";

function VerifyEmail() {
  const [message, setMessage] = useState("กำลังตรวจสอบลิงก์ยืนยันอีเมล...");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const token = hashParams.get("token_hash");
      const type = hashParams.get("type") || "signup";

      // ✅ ถ้าไม่มี token ให้ลองตรวจสอบ user ปัจจุบันแทน
      if (!token) {
        const { data } = await supabase.auth.getUser();
        if (data?.user?.email_confirmed_at) {
          setMessage("✅ อีเมลของคุณได้รับการยืนยันแล้ว!");
          setTimeout(() => navigate("/"), 1000);
        } else {
          setMessage("❌ ไม่พบ token ในลิงก์ หรือ ลิงก์ไม่ถูกต้อง");
        }
        return;
      }

      // ✅ ถ้ามี token ก็ verify ปกติ
      const { error } = await supabase.auth.verifyOtp({
        type,
        token_hash: token,
      });

      if (error) {
        console.error("Verification error:", error);
        setMessage("❌ ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
      } else {
        setMessage("✅ อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว!");
        setTimeout(() => navigate("/"), 3000);
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
