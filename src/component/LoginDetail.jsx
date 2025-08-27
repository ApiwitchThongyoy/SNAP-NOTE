import { useState } from "react";

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
    // เด้งข้อความขึ้นจอ
    alert("Welcome");
    // ล้างค่า input หลังจากกด login ถ้าต้องการ
    setEmail("");
    setPassword("");
  }

  return (
    <>
      <h4>SNAPNOTE</h4>
      <form onSubmit={handleSubmit}>
        <div>
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
          <input
            type="password"
            id="Password"
            value={password}
            onChange={handlePasswordChange}
            placeholder="Enter your Password"
            required
          />
        </div>
        <input type="submit" value="Login" />
      </form>
    </>
  );
}

export default LoginDetail;
