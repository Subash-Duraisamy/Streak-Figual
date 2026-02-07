import { useEffect, useState } from "react";
import "./Timer.css";

function Timer() {
  const [hours, setHours] = useState(0);
  const [minutes, setMinutes] = useState(10);
  const [seconds, setSeconds] = useState(0);

  const [total, setTotal] = useState(0);
  const [left, setLeft] = useState(0);

  const [running, setRunning] = useState(false);
  const [blink, setBlink] = useState(false);

  // ⏳ TIMER CORE (PAUSE / RESUME SAFE)
  useEffect(() => {
    if (!running) return;

    if (left <= 0) {
      setRunning(false);
      setBlink(true);
      return;
    }

    const interval = setInterval(() => {
      setLeft(l => l - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [running, left]);

  // ▶ START or ▶ RESUME
  const start = () => {
    if (left > 0) {
      // resume
      setRunning(true);
      setBlink(false);
      return;
    }

    const t = hours * 3600 + minutes * 60 + seconds;
    if (t <= 0) return;

    setTotal(t);
    setLeft(t);
    setBlink(false);
    setRunning(true);
  };

  // ⏸ PAUSE
  const pause = () => {
    setRunning(false);
  };

  // ⟲ RESET
  const reset = () => {
    setRunning(false);
    setBlink(false);
    setLeft(0);
  };

  // ⛔ STOP ALERT
  const stopAlert = () => {
    setBlink(false);
  };

  // 🕰 FORMAT DISPLAY
  const hh = String(Math.floor(left / 3600)).padStart(2, "0");
  const mm = String(Math.floor((left % 3600) / 60)).padStart(2, "0");
  const ss = String(left % 60).padStart(2, "0");

  const fill = total ? ((total - left) / total) * 100 : 0;

  return (
    <div className={`timer-bg ${blink ? "blink" : ""}`}>

      {/* 🌊 FULL PAGE WATER */}
      <div
        className="water"
        style={{ height: `${fill}%` }}
      />

      {/* ⏱ TIME */}
      <div className="timer-ui">
        <div className="time-text">
          {hh !== "00" && <span>{hh}</span>}
          {hh !== "00" && <span className="colon">:</span>}
          <span>{mm}</span>
          <span className="colon">:</span>
          <span>{ss}</span>
        </div>

        {/* INPUTS (ONLY WHEN NOT RUNNING) */}
        {!running && left === 0 && (
          <div className="inputs">
            <input type="number" min="0" value={hours} onChange={e => setHours(+e.target.value)} /> hr
            <input type="number" min="0" max="59" value={minutes} onChange={e => setMinutes(+e.target.value)} /> min
            <input type="number" min="0" max="59" value={seconds} onChange={e => setSeconds(+e.target.value)} /> sec
          </div>
        )}

        {/* CONTROLS */}
        <div className="controls">
          {!running ? (
            <button onClick={start}>
              {left > 0 ? "Resume" : "Start"}
            </button>
          ) : (
            <button onClick={pause}>Pause</button>
          )}

          <button onClick={reset}>Reset</button>

          {blink && (
            <button className="stop" onClick={stopAlert}>
              Stop Alert
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

export default Timer;
