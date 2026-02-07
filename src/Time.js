import { useEffect, useState } from "react";
import "./Time.css";

function Time() {
  const [now, setNow] = useState(new Date());

  useEffect(() => {
    const clock = setInterval(() => setNow(new Date()), 1000);

    // auto-hide navbar after 7s
    const hideTimer = setTimeout(() => {
      document.body.classList.add("nav-hidden");
    }, 7000);

    // show navbar on mouse near top
    const onMouseMove = (e) => {
      if (e.clientY < 60) {
        document.body.classList.remove("nav-hidden");
      }
    };

    // show navbar on double tap (mobile)
    let lastTap = 0;
    const onTouchEnd = () => {
      const nowTap = Date.now();
      if (nowTap - lastTap < 300) {
        document.body.classList.remove("nav-hidden");
      }
      lastTap = nowTap;
    };

    window.addEventListener("mousemove", onMouseMove);
    window.addEventListener("touchend", onTouchEnd);

    return () => {
      clearInterval(clock);
      clearTimeout(hideTimer);
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("touchend", onTouchEnd);
      document.body.classList.remove("nav-hidden");
    };
  }, []);

  // 🕰 TIME LOGIC (CLEAN & SAFE)
  let hours = now.getHours();
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const ampm = hours >= 12 ? "PM" : "AM";
  hours = hours % 12 || 12;

  return (
    <div className="time-bg">
      <div className="time-glass">
        <div className="time-main">
          <span className="time-hours">{hours}</span>
          <span className="time-colon">:</span>
          <span className="time-minutes">{minutes}</span>
        </div>

        <div className="time-ampm">{ampm}</div>
        <div className="time-seconds">{seconds}</div>
      </div>
    </div>
  );
}

export default Time;
