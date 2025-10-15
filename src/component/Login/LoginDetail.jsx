import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";
<<<<<<< HEAD

import { AuthContext } from "../../context/AuthContext";

import { supabase } from "../../supabaseClient";
=======
>>>>>>> parent of 30aaee7 (ทำให้บันทึกข้อมูล sing up และ การตรวจสอบอีเมลก่อนเข้าสู่ระบบ)


function LoginDetail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);

<<<<<<< HEAD
  async function handleSubmit(e) {
    e.preventDefault();

    if (!email || !password) {
      alert("กรุณากรอกอีเมลและรหัสผ่านให้ครบถ้วน");
      return;
    }


  function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === password);
    if (found) {
      localStorage.setItem("user", JSON.stringify(found));
      login({ username: found.username, email: found.email });
      alert("Welcome" + found.username);
      setEmail("");
      setPassword("");

    try {
      setLoading(true);

      // ✅ เข้าสู่ระบบผ่าน Supabase Auth
      const { data , error } = await supabase.auth.signInWithPassword({
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
=======
  function handleEmailChange(e) {
    setEmail(e.target.value);
>>>>>>> parent of 30aaee7 (ทำให้บันทึกข้อมูล sing up และ การตรวจสอบอีเมลก่อนเข้าสู่ระบบ)
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    const users = JSON.parse(localStorage.getItem("users")) || [];
    const found = users.find(u => u.email === email && u.password === password);
    if (!found) {
      alert("Welcome");
      setEmail("");
      setPassword("");
      navigate("/main-page");
    } else {
      alert("Invalid email or password");
    }
  }
  
  return (
    <div class="relative flex min-h-screen bg-[#56A750]">
      <div class="absolute left-0 top-0 h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          class="w-full h-full object-cover"
        />
      </div>

      <div class="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 class="text-3xl font-bold mb-6 text-start text-xxl text-[#164C11]">
          Sign in
        </h1>

        <form onSubmit={handleSubmit} class="flex flex-col">
          <label class="mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your E-mail"
            required
            class="w-[550px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <label class="mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your Password"
            required
            class="w-[550px] p-4 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <div class="flex flex-row gap-90 text-sm mb-6">
            <span class="text-[#000000] cursor-pointer hover:underline"
            onClick={() => navigate("/sign-up")}
            >
              Sign up?
            </span>
            <span class="text-[#000000] cursor-pointer hover:underline"
            onClick={() => navigate("/reset-password")}
            >
              Forget Password?
            </span>
          </div>

          <button
            type="submit"
            class="w-[550px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 transition-colors cursor-pointer font-bold"
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginDetail;
  