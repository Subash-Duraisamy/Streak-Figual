import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "./firebase";
import { useEffect, useState } from "react";
import "./Streak.css";

function Streak({ user }) {
  const [streak, setStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);
  const [completedDates, setCompletedDates] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [animate, setAnimate] = useState(false);

  const today = new Date().toDateString();

  /* 🔢 CURRENT STREAK (ENDS TODAY) */
  const calculateCurrentStreak = (dates) => {
    let count = 0;
    let day = new Date();

    while (dates.includes(day.toDateString())) {
      count++;
      day = new Date(day.getTime() - 86400000);
    }

    return count;
  };

  /* 🏆 LONGEST STREAK (HISTORY) */
  const calculateLongestStreak = (dates) => {
    if (dates.length === 0) return 0;

    const sorted = dates
      .map(d => new Date(d).getTime())
      .sort((a, b) => a - b);

    let max = 1;
    let current = 1;

    for (let i = 1; i < sorted.length; i++) {
      if (sorted[i] - sorted[i - 1] === 86400000) {
        current++;
        max = Math.max(max, current);
      } else {
        current = 1;
      }
    }

    return max;
  };

  /* 🔄 LOAD USER DATA */
  useEffect(() => {
    const load = async () => {
      const ref = doc(db, "users", user.uid);
      const snap = await getDoc(ref);
      if (!snap.exists()) return;

      const data = snap.data();
      const dates = data.completedDates || [];

      const current = calculateCurrentStreak(dates);
      const longest = calculateLongestStreak(dates);

      setCompletedDates(dates);
      setStreak(current);
      setLongestStreak(longest);

      await updateDoc(ref, {
        streak: current,
        longestStreak: longest,
      });
    };

    load();
  }, [user]);

  /* ✅ YES */
  const markYes = async () => {
    if (completedDates.includes(today)) return;

    const newDates = [...completedDates, today];
    const newStreak = calculateCurrentStreak(newDates);
    const newLongest = calculateLongestStreak(newDates);

    setAnimate(false);
    setTimeout(() => setAnimate(true), 50);

    setCompletedDates(newDates);
    setStreak(newStreak);
    setLongestStreak(newLongest);

    await updateDoc(doc(db, "users", user.uid), {
      completedDates: newDates,
      streak: newStreak,
      longestStreak: newLongest,
    });
  };

  /* ❌ NO (REMOVE TODAY ONLY) */
  const markNo = async () => {
    const newDates = completedDates.filter(d => d !== today);

    const newStreak = calculateCurrentStreak(newDates);
    const newLongest = calculateLongestStreak(newDates);

    setCompletedDates(newDates);
    setStreak(newStreak);
    setLongestStreak(newLongest);

    await updateDoc(doc(db, "users", user.uid), {
      completedDates: newDates,
      streak: newStreak,
      longestStreak: newLongest,
    });
  };

  /* 📅 CALENDAR */
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
      <div className="streak-header">
        <div className={`flame ${streak > 0 ? "burning" : ""}`}>🔥</div>

        <div className={`streak-count ${animate ? "pop" : ""}`}>
          {streak}
        </div>

        <p className="motivation">
          Longest streak: <strong>{longestStreak}</strong>
        </p>
      </div>

      <div className="month-nav">
        <button onClick={() => setCurrentMonth(new Date(year, month - 1, 1))}>‹</button>
        <span>{currentMonth.toLocaleString("default", { month: "long", year: "numeric" })}</span>
        <button onClick={() => setCurrentMonth(new Date(year, month + 1, 1))}>›</button>
      </div>

      <div className="weekdays">
        {["Sun","Mon","Tue","Wed","Thu","Fri","Sat"].map(d => (
          <div key={d}>{d}</div>
        ))}
      </div>

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

      <div className="actions">
        <button className="yes" onClick={markYes}>YES</button>
        <button className="no" onClick={markNo}>NO</button>
      </div>
    </div>
  );
}

export default Streak;
