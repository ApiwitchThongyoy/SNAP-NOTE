import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";

function UpdatePassword() {
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const navigate = useNavigate();

  async function handleUpdatePassword(e) {
    e.preventDefault();

    if (newPassword !== confirm) {
      alert("รหัสผ่านไม่ตรงกัน");
      return;
    }

    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      alert("❌ " + error.message);
    } else {
      alert("✅ รีเซ็ตรหัสผ่านสำเร็จ");
      navigate("/");
    }
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#E9FFD8]">
      <div className="bg-white p-10 rounded-2xl shadow-lg text-center">
        <h1 className="text-3xl font-bold text-[#164C11] mb-4">
          ตั้งรหัสผ่านใหม่
        </h1>
        <form onSubmit={handleUpdatePassword} className="flex flex-col items-center">
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="รหัสผ่านใหม่"
            required
            className="w-[350px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="ยืนยันรหัสผ่าน"
            required
            className="w-[350px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />
          <button
            type="submit"
            className="w-[350px] bg-[#164C11] text-white py-3 rounded font-bold hover:bg-green-600"
          >
            ยืนยันการเปลี่ยนรหัสผ่าน
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
