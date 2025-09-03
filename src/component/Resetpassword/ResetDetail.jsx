import { useState } from "react";
import Logo_Login from "../../assets/Logo_Login.svg";
import { BsArrowLeftCircleFill } from "react-icons/bs";

function ResetPassword() {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [generatedOtp, setGeneratedOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleRequestOtp() {
    const newOtp = Math.floor(100000 + Math.random() * 900000).toString();
    setGeneratedOtp(newOtp);
    alert(`OTP ของคุณคือ: ${newOtp}`);
  }

  function handleSubmit(e) {
    e.preventDefault();

    if (!/^\d{6}$/.test(otp)) {
      alert("กรุณากรอก OTP 6 หลักให้ถูกต้อง");
      return;
    }

    if (otp !== generatedOtp) {
      alert("OTP ไม่ถูกต้อง");
      return;
    }

    if (newPassword !== confirmPassword) {
      alert("รหัสผ่านใหม่และยืนยันรหัสผ่านไม่ตรงกัน");
      return;
    }

    alert(`รีเซ็ตรหัสผ่านสำเร็จ!\nEmail: ${email}`);

    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      <div>
        <button className="absolute top-4 right-20 text-6xl text-[#164C11] cursor-pointer z-50">
          <BsArrowLeftCircleFill />
        </button>
      </div>

      <div className="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-xxl text-[#164C11]">
          Reset Password
        </h1>

        <form onSubmit={handleSubmit} className="flex flex-col">
          <div>
            Email
            <br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your E-mail"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleRequestOtp}
              className="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 transition-colors cursor-pointer font-bold mb-4"
            >
              รับรหัส OTP
            </button>
          </div>

          <div>
            OTP
            <br />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            New Password
            <br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create New Password"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <div>
            Confirm Password
            <br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your Password"
              required
              className="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
            />
          </div>

          <button
            type="submit"
            className="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 transition-colors cursor-pointer font-bold"
          >
            Reset
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
