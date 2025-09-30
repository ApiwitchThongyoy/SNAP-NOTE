import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Logo_Login from "../../assets/Logo_Login.svg";

function LoginDetail() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

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
    navigate("/main-page");
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
  