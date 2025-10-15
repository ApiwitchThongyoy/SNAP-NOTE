import { useEffect, useState } from "react";
import { supabase } from "../../supabaseClient";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/snapnote-logo.png"; // ← โลโก้ SNAP-NOTE

function VerifyEmail() {
  const [message, setMessage] = useState("กำลังตรวจสอบลิงก์ยืนยันอีเมล...");
  const navigate = useNavigate();

  useEffect(() => {
    async function verifyEmail() {
      const params = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = params.get("access_token");
      const errorCode = params.get("error_code");

      // ✅ ถ้ามี error จาก URL (เช่น ลิงก์หมดอายุ)
      if (errorCode) {
        setMessage("❌ ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
        return;
      }

      if (!accessToken) {
        setMessage("❌ ไม่พบโทเค็นในลิงก์ยืนยันอีเมล");
        return;
      }

      const { error } = await supabase.auth.verifyOtp({
        type: "signup",
        token_hash: accessToken,
      });

      if (error) {
        setMessage("❌ ลิงก์ยืนยันอีเมลไม่ถูกต้องหรือหมดอายุ");
      } else {
        alert("อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว! 🎉");
        setMessage("✅ อีเมลของคุณได้รับการยืนยันเรียบร้อยแล้ว!");
        setTimeout(() => navigate("/"), 0);
      }
    }

    verifyEmail();
  }, [navigate]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E9FFD8]">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white shadow-xl rounded-3xl p-10 text-center max-w-md w-full"
      >
        <img
          src={logo}
          alt="SNAP-NOTE Logo"
          className="w-24 h-24 mx-auto mb-4 drop-shadow-md"
        />
        <h1 className="text-3xl font-bold text-[#164C11] mb-4">
          Email Verification
        </h1>
        <p className="text-lg text-gray-700">{message}</p>
      </motion.div>
    </div>
  );
}

export default VerifyEmail;
