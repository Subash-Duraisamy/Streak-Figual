import { useEffect, useState } from "react";
import { doc, getDoc, setDoc, serverTimestamp } from "firebase/firestore";
import { db } from "./firebase";

import Navbar from "./Navbar";
import Streak from "./Streak";
import Time from "./Time";
import Timer from "./Timer";

function Dashboard({ user }) {
  const [mode, setMode] = useState("streak");
  const [userName, setUserName] = useState("");

  // 🔥 create / load user
  useEffect(() => {
    const initUser = async () => {
      if (!user) return;

      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);

      if (!snap.exists()) {
        await setDoc(ref, {
          name: user.displayName || "User",
          email: user.email,
          streak: 0,
          longestStreak: 0,
          completedDates: [],
          lastDate: "",
          createdAt: serverTimestamp(),
        });
        setUserName(user.displayName || "User");
      } else {
        setUserName(snap.data().name);
      }
    };

    initUser();
  }, [user]);

  // 🌙 GLOBAL AUTO-HIDE NAVBAR
  useEffect(() => {
    let hideTimer;

    const startTimer = () => {
      clearTimeout(hideTimer);
      document.body.classList.remove("nav-hidden");

      hideTimer = setTimeout(() => {
        document.body.classList.add("nav-hidden");
      }, 7000);
    };

    // mouse near top
    const onMouseMove = (e) => {
      if (e.clientY < 60) startTimer();
    };

    // double tap (mobile)
    let lastTap = 0;
    const onTouchEnd = () => {
      const now = Date.now();
      if (now - lastTap < 300) startTimer();
      lastTap = now;
    };

    startTimer();

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      clearTimeout(hideTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.body.classList.remove("nav-hidden");
    };
  }, []);

  return (
    <div style={{ height: "100vh", overflow: "hidden" }}>
      <Navbar
        mode={mode}
        setMode={(m) => {
          setMode(m);
          document.body.classList.remove("nav-hidden");
        }}
        user={user}
        userName={userName}
        setUserName={setUserName}
      />

      {mode === "streak" && <Streak user={user} />}
      {mode === "time" && <Time />}
      {mode === "timer" && <Timer />}
    </div>
  );
}

export default Dashboard;
