import { useState } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { db, auth } from "./firebase";
import "./Navbar.css";

function Navbar({ setMode, mode, user, userName, setUserName }) {
  const [editing, setEditing] = useState(false);
  const [tempName, setTempName] = useState(userName || "");

  const saveName = async () => {
    if (!tempName.trim()) return;

    await updateDoc(doc(db, "users", user.uid), {
      name: tempName.trim(),
    });

    setUserName(tempName.trim());
    setEditing(false);
  };

  /* 🔓 LOGOUT */
  const logout = async () => {
    await signOut(auth);
  };

  return (
    <div className="navbar-wrapper">

      {/* 👤 USER */}
      <div className="nav-user">
        <div className="avatar">
          {userName?.charAt(0)?.toUpperCase() || "U"}
        </div>

        {mode !== "time" && (
          !editing ? (
            <span
              className="username"
              onClick={() => {
                setTempName(userName);
                setEditing(true);
              }}
            >
              {userName}
            </span>
          ) : (
            <input
              className="username-input"
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={saveName}
              onKeyDown={(e) => e.key === "Enter" && saveName()}
              autoFocus
            />
          )
        )}
      </div>

      {/* 🔥 NAV + LOGOUT */}
      <div className="navbar">
        <button
          className={`nav-btn ${mode === "streak" ? "active" : ""}`}
          onClick={() => setMode("streak")}
        >
          🔥
        </button>

        <button
          className={`nav-btn ${mode === "time" ? "active" : ""}`}
          onClick={() => setMode("time")}
        >
          ⏰
        </button>

        <button
          className={`nav-btn ${mode === "timer" ? "active" : ""}`}
          onClick={() => setMode("timer")}
        >
          ⏱
        </button>

        {/* 🚪 LOGOUT ICON */}
        <button
          className="nav-btn logout"
          onClick={logout}
          title="Logout"
        >
          ⎋
        </button>
      </div>
    </div>
  );
}

export default Navbar;
