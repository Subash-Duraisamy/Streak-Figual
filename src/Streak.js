import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import "./Streak.css";

function Streak({ user }) {
  const [streak, setStreak] = useState(0);
  const [lastDate, setLastDate] = useState("");
  const [completedDates, setCompletedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (snap.exists()) {
        const data = snap.data();
        setStreak(data.streak || 0);
        setLastDate(data.lastDate || "");
        setCompletedDates(data.completedDates || []);
      }
    };
    load();
  }, [user]);

  const today = new Date().toDateString();
  const yesterday = new Date(Date.now() - 86400000).toDateString();

  // YES
  const markYes = async () => {
    if (lastDate === today) return;

    const newStreak = lastDate === yesterday ? streak + 1 : 1;
    const updatedDates = completedDates.includes(today)
      ? completedDates
      : [...completedDates, today];

    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);

    setStreak(newStreak);
    setLastDate(today);
    setCompletedDates(updatedDates);

    await updateDoc(doc(db, "users", user.uid), {
      streak: newStreak,
      lastDate: today,
      completedDates: updatedDates,
      longestStreak: Math.max(newStreak, streak),
    });
  };

  // NO
  const markNo = async () => {
    const updatedDates = completedDates.filter(d => d !== today);

    setAnimate(false);

    setStreak(0);
    setLastDate("");
    setCompletedDates(updatedDates);

    await updateDoc(doc(db, "users", user.uid), {
      streak: 0,
      lastDate: "",
      completedDates: updatedDates,
    });
  };

  // Calendar
  const year = currentMonth.getFullYear();
  const month = currentMonth.getMonth();
  const firstDay = new Date(year, month, 1).getDay();
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const days = [
    ...Array(firstDay).fill(null),
    ...Array(daysInMonth).fill(0).map((_, i) => i + 1),
  ];

  return (
    <div className="streak-container">
      {/* HEADER */}
      <div className="streak-header">
        <div className={`flame ${streak > 0 ? "burning" : ""}`}>🔥</div>

        <div className={`streak-count ${animate ? "pop" : ""}`}>
          {streak}
        </div>

        <p className="motivation">Keep up your streak!</p>
      </div>

      {/* MONTH NAV */}
      <div className="month-nav">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
        <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
      </div>

      {/* WEEKDAYS */}
      <div className="weekdays">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

      {/* CALENDAR */}
      <div className="calendar">
        {days.map((day, i) => {
          if (!day) return <div key={i} />;

          const dateStr = new Date(year, month, day).toDateString();
          const active = completedDates.includes(dateStr);
          const isToday = dateStr === today;

          return (
            <div
              key={i}
              className={`day ${active ? "active" : ""} ${isToday ? "today" : ""}`}
            >
              {day}
            </div>
          );
        })}
      </div>

      {/* ACTIONS */}
      <div className="actions">
        <button className="yes" onClick={markYes}>YES</button>
        <button className="no" onClick={markNo}>NO</button>
      </div>
    </div>
  );
}

export default Streak;
