import { useState } from "react";
import Logo_Login from "../assets/Logo_Login.svg";
import "../component/Login.css";

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

  const linkStyle = {
    display: "flex",
    gap: "35px",
    marginBottom: "10px",
    fontSize:"20px"
  };

  

  return (
    <div>
      <img src={Logo_Login} alt="logo" />
      <div className="container">
        <h1>Sign in</h1>
        <form onSubmit={handleSubmit}>
          <div>
            Email<br />
            <input
              type="email"
              id="Email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Enter your E-mail"
              required
            />
          </div>

          <div>
            Password<br />
            <input
              type="password"
              id="Password"
              value={password}
              onChange={handlePasswordChange}
              placeholder="Enter your Password"
              required
            />
          </div>

          <div style={linkStyle}>
            <span>sign up?</span>
            <span>Forget Password?</span>
          </div>

          <button>Sign in</button>
        </form>
      </div>
    </div>
  );
}

export default LoginDetail;
