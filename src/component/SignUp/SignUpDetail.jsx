import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "../../supabaseClient";
import Logo_Login from "../../assets/Logo_Login.svg";
// Import the icon you are trying to use
import { BsArrowLeftCircleFill } from "react-icons/bs"; 

// SVG Component for the Back Arrow Icon (No change needed here)
function BackArrowIcon() {
  return (
    <svg
      stroke="currentColor"
      fill="currentColor"
      strokeWidth="0"
      viewBox="0 0 16 16"
      height="1em"
      width="1em"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M1 8a7 7 0 1 0 14 0A7 7 0 0 0 1 8zm15 0A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-4.5-.5a.5.5 0 0 1 0 1H5.707l2.147 2.146a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L5.707 7.5H11.5z"></path>
    </svg>
  );
}

// Placeholder for the Logo (No change needed here, though it's unused in the final component)
function PlaceholderLogo() {
  return (
    <div className="left-0 top-0 h-full w-full"> 
      <img
        src={Logo_Login}
        alt="Snapnote Logo"
        className="w-full h-full"
      />
    </div>
  );
}

function SignUpDetail() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!username || !email || !password || !confirmPassword) {
      alert("กรุณากรอกข้อมูลให้ครบทุกช่อง"); // Please fill in all fields
      return;
    }

    if (password !== confirmPassword) {
      alert("รหัสผ่านไม่ตรงกัน"); // Passwords do not match
      return;
    }

    // ✅ เช็กว่าอีเมลนี้มีอยู่แล้วในระบบไหม
    // Note: If 'check_email_exists' is a Postgres function, this is fine, but 
    // it's generally better to let the 'signUp' method handle the unique email constraint 
    // unless you need a custom message. Assuming the RPC call is correct.
    const { data: emailExists, error: checkError } = await supabase.rpc(
      "check_email_exists",
      { email_input: email }
    );

    if (checkError) {
      alert("เกิดข้อผิดพลาดระหว่างตรวจสอบอีเมล: " + checkError.message); // Error checking email
      return;
    }

    if (emailExists) {
      alert("อีเมลนี้ถูกใช้แล้ว กรุณาเข้าสู่ระบบแทน"); // Email is already in use. Please log in instead.
      return;
    }

    // ✅ สมัครสมาชิกใหม่
    const { data , error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo: "http://localhost:5173/verify-email",
      },
    });

    if (error) {
      alert("สมัครสมาชิกไม่สำเร็จ: " + error.message); // Sign up failed
      return;
    }
    
    // Check if the user object is returned after a successful sign-up
    if (data?.user) {
      alert("สมัครสมาชิกสำเร็จ! 🎉 โปรดยืนยันอีเมลก่อนเข้าสู่ระบบ"); // Sign up successful! Please verify email before logging in
      // Do not navigate yet, as the user needs to verify their email
    }
    
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");

    navigate("/");
  };

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      {/* 🛑 FIX: Use the imported icon component */}
      <button
        className="absolute top-4 right-20 text-6xl text-[#164C11] z-50"
        onClick={() => navigate(-1)}
      >
        <BsArrowLeftCircleFill /> {/* This requires an import of BsArrowLeftCircleFill */}
      </button>

      <div className="absolute left-0 top-0 h-full">
        <img src={Logo_Login} alt="left-side" className="w-full h-full object-cover" />
      </div>

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