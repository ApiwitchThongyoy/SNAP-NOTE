import { useState } from "react";
import Logo_Login from "../../assets/Logo_Login.svg";

function LoginDetail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  function handleEmailChange(e) {
    setEmail(e.target.value);
  }

  function handlePasswordChange(e) {
    setPassword(e.target.value);
  }

  function handleSubmit(e) {
    e.preventDefault();
    alert("Welcome");
    setEmail("");
    setPassword("");
  }

  return (
    <div className="relative flex min-h-screen bg-[#56A750]">
      {/* รูปภาพฝั่งซ้าย */}
      <div className="absolute left-0 top-0  h-full">
        <img
          src={Logo_Login}
          alt="left-side"
          className="w-full h-full object-cover"
        />
      </div>

      {/* ฟอร์มฝั่งขวา */}
      <div className="ml-auto w-1/2 p-8 flex flex-col justify-center z-10">
        <h1 className="text-3xl font-bold mb-6 text-start text-xxl text-[#164C11]">
          Sign in
        </h1>
        <form onSubmit={handleSubmit} className="flex flex-col">
          <label className="mb-2 font-medium">Email</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="Enter your E-mail"
            required
            className="w-[500px] p-3 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <label className="mb-2 font-medium">Password</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your Password"
            required
            className="w-[500px] p-4 border rounded mb-4 text-sm bg-[#BDFFA7]"
          />

          <div className="flex flex-row gap-85 text-sm mb-6">
  <span className="text-[#000000] cursor-pointer hover:underline">
    Sign up?
  </span>
  <span className="text-[#000000] cursor-pointer hover:underline">
    Forget Password?
  </span>
</div>  

          <button
            type="submit"
            className="w-[500px] bg-[#164C11] text-white py-3 rounded hover:bg-green-600 transition-colors cursor-pointer font-bold "
          >
            Sign in
          </button>
        </form>
      </div>
    </div>
  );
}

export default LoginDetail;
