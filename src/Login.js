import { useState } from "react";
import {
  GoogleAuthProvider,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signInWithPhoneNumber,
  RecaptchaVerifier
} from "firebase/auth";
import { auth } from "./firebase";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmation, setConfirmation] = useState(null);

  /* 🔥 GOOGLE LOGIN */
  const googleLogin = async () => {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  };

  /* 📧 EMAIL LOGIN */
  const emailLogin = async () => {
    await signInWithEmailAndPassword(auth, email, password);
  };

  /* 🆕 EMAIL REGISTER */
  const emailRegister = async () => {
    await createUserWithEmailAndPassword(auth, email, password);
  };

  /* 📱 SEND OTP */
  const sendOtp = async () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        auth,
        "recaptcha-container",
        { size: "invisible" }
      );
    }

    const result = await signInWithPhoneNumber(
      auth,
      phone,
      window.recaptchaVerifier
    );

    setConfirmation(result);
  };

  /* 🔐 VERIFY OTP */
  const verifyOtp = async () => {
    if (!confirmation) return;
    await confirmation.confirm(otp);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="title">Welcome</h2>

        <button className="btn google" onClick={googleLogin}>
          Sign in with Google
        </button>

        <div className="divider">OR</div>

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={e => setEmail(e.target.value)}
        />

        <input
          className="input"
          type="password"
          placeholder="Password"
          value={password}
          onChange={e => setPassword(e.target.value)}
        />

        <div className="row">
          <button className="btn" onClick={emailLogin}>Login</button>
          <button className="btn outline" onClick={emailRegister}>Register</button>
        </div>

        <div className="divider">OR</div>

        <input
          className="input"
          placeholder="+91XXXXXXXXXX"
          value={phone}
          onChange={e => setPhone(e.target.value)}
        />

        <button className="btn" onClick={sendOtp}>
          Send OTP
        </button>

        {confirmation && (
          <>
            <input
              className="input"
              placeholder="Enter OTP"
              value={otp}
              onChange={e => setOtp(e.target.value)}
            />
            <button className="btn success" onClick={verifyOtp}>
              Verify OTP
            </button>
          </>
        )}

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
}

export default Login;
