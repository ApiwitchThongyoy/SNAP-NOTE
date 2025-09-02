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
    
    // ล้างค่า input
    setEmail("");
    setOtp("");
    setNewPassword("");
    setConfirmPassword("");
    setGeneratedOtp("");
  }

  return (
    <div>
      <div>
        <button>
          <BsArrowLeftCircleFill />
        </button>
      </div>

      <img src={Logo_Login} alt="logo" />
      <div>
        <h1>Reset Password</h1>
        <form onSubmit={handleSubmit}>
          <div>
            Email<br />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your E-mail"
              required
            />
          </div>

          <div>
            <button
              type="button"
              onClick={handleRequestOtp}
              style={{
                margin: "10px 0",
                padding: "10px",
                borderRadius: "10px",
                backgroundColor: "#164C11",
                color: "#FFF0F0",
                fontWeight: "bold",
                cursor: "pointer"
              }}
            >
            </button>
          </div>

          <div>
            OTP<br />
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              placeholder="Enter 6-digit OTP"
              maxLength={6}
              required
            />
          </div>

          <div>
            New Password<br />
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Create New Password"
              required
            />
          </div>

          <div>
            Confirm Password<br />
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Confirm your Password"
              required
            />
          </div>

          <button type="submit">Reset</button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
