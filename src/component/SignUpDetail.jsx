import { useState } from "react";
import Logo_Login from "../assets/Logo_Login.svg";
import "../component/SignUpDetail.css";

function SignUpDetail() {
  const [username, setUsername] = useState("");  // ⭐ state ของ Username
  const [email, setEmail] = useState("");        // ⭐ state ของ Email
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  function handleSubmit(e) {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }

    // สมมติว่า signup สำเร็จ
    alert(`Sign Up Successful!\nUsername: ${username}\nEmail: ${email}`);

    // reset form
    setUsername("");
    setEmail("");
    setPassword("");
    setConfirmPassword("");
  }

  return (
    <div>
      <img src={Logo_Login} alt="logo" />
      <div className="container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSubmit}>
          <div>
            Username<br />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your Username"
              required
            />
          </div>
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
            Password<br />
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your Password"
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
          <button type="submit">Sign Up</button>
        </form>
      </div>
    </div>
  );
}

export default SignUpDetail;
