import { useMemo, useState } from "react";
import "./App.css";

function App() {
  // modal for choosing weekend removed; calendar will be shown inline
  const [confirmed, setConfirmed] = useState(false);
  const [weekend, setWeekend] = useState("");
  const [showRevealModal, setShowRevealModal] = useState(false);
  const [showGiftCard, setShowGiftCard] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });

  // Customize this list with the dates you're available (ISO yyyy-mm-dd)
  const availableDates = useMemo(
    () => [
      "2026-03-06",
      "2026-03-07",
      "2026-03-13",
      "2026-03-14",
      "2026-04-03",
      "2026-04-04",
      "2026-04-10",
      "2026-04-11",
    ],
    [],
  );

  function openGift() {
    setShowCalendar(true);
    setConfirmed(false);
    setWeekend("");
  }

  function confirmGift(e) {
    // kept for compatibility but selection is confirmed via inline button
    e && e.preventDefault && e.preventDefault();
    setConfirmed(true);
  }

  function confirmSelectedWeekend() {
    if (!selectedRange.start || !selectedRange.end) return;
    setWeekend(`${selectedRange.start} to ${selectedRange.end}`);
    setConfirmed(true);
    setShowCalendar(false);
  }

  function formatISO(d) {
    return d.toISOString().slice(0, 10);
  }

  function onCalendarSelect(day) {
    // day is a Date
    const iso = formatISO(day);
    // only allow selecting available dates
    if (!availableDates.includes(iso)) return;

    const { start, end } = selectedRange;
    if (!start || (start && end)) {
      setSelectedRange({ start: iso, end: null });
    } else if (start && !end) {
      // ensure chronological order
      if (iso >= start) setSelectedRange({ start, end: iso });
      else setSelectedRange({ start: iso, end: start });
    }
  }

  return (
    <div id="root">
      <header className="header">
        <h1 className="title">Happy Birthday!</h1>
        <p className="subtitle">A small surprise — from me to you 🎁</p>
      </header>

      <main className="cards">
        <div
          role="alert"
          className="alert alert-info"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="h-6 w-6 shrink-0 stroke-current"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>New software update available.</span>
        </div>
        {!showGiftCard && (
          <section className="card happy">
            <h2>🎉 Happy Birthday!</h2>
            <p>
              Wishing you a day filled with love, laughter, and everything that makes you smile. You're amazing and I
              hope this year brings you wonderful memories.
            </p>
            <button
              className="btn"
              onClick={() => window.alert("Hooray! Happy Birthday!")}
            >
              Open
            </button>
          </section>
        )}

        {showGiftCard && (
          <section className="card gift">
            <h2>🎒 Your Gift</h2>
            <p>
              I'm gifting you a weekend trip (Airbnb) for the weekend of your choosing. Click below to pick a weekend
              and I'll arrange everything.
            </p>
            <button
              className="btn primary"
              onClick={openGift}
            >
              Choose Weekend
            </button>
          </section>
        )}
      </main>

      <div style={{ textAlign: "center", marginTop: 18 }}>
        <button
          className="btn primary"
          onClick={() => setShowRevealModal(true)}
        >
          What's my gift?
        </button>
      </div>

      {showGiftCard && (
        <section className="card gift">
          <h2>🎒 Your Gift</h2>
          <p>
            I'm gifting you a weekend trip (Airbnb) for the weekend of your choosing. Use the calendar below to pick a
            weekend and I'll arrange everything.
          </p>
          <div style={{ display: "flex", gap: 8, alignItems: "center" }}>
            <button
              className="btn primary"
              onClick={openGift}
            >
              Choose Weekend
            </button>
            {confirmed && (
              <span className="muted">
                Chosen: <strong style={{ color: "#333", marginLeft: 6 }}>{weekend}</strong>
              </span>
            )}
          </div>

          {showCalendar && (
            <div style={{ marginTop: 12 }}>
              <div className="calendarWrap">
                <Calendar
                  availableDates={availableDates}
                  onSelect={onCalendarSelect}
                  selectedRange={selectedRange}
                />
              </div>
              <div style={{ display: "flex", gap: 8, justifyContent: "flex-end", marginTop: 8 }}>
                <button
                  className="btn"
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectedRange({ start: null, end: null });
                  }}
                >
                  Cancel
                </button>
                <button
                  className="btn primary"
                  onClick={confirmSelectedWeekend}
                  disabled={!selectedRange.start || !selectedRange.end}
                >
                  Confirm
                </button>
              </div>
            </div>
          )}
        </section>
      )}

      {showRevealModal && (
        <div
          className="modalOverlay"
          role="dialog"
          aria-modal="true"
        >
          <div className="modal">
            <div className="modalContent">
              <h3>Do you want to see your gift?</h3>
              <p className="muted">Click Yes to reveal your surprise.</p>
              <div className="modalActions">
                <button
                  className="btn"
                  onClick={() => setShowRevealModal(false)}
                >
                  No
                </button>
                <button
                  className="btn primary"
                  onClick={() => {
                    setShowGiftCard(true);
                    setShowRevealModal(false);
                  }}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <footer className="footer">With love — your friend</footer>
    </div>
  );
}

export default App;

function Calendar({ availableDates, onSelect, selectedRange }) {
  const [month, setMonth] = useState(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  });

  function startOfMonth(d) {
    return new Date(d.getFullYear(), d.getMonth(), 1);
  }

  function addMonth(d, n) {
    return new Date(d.getFullYear(), d.getMonth() + n, 1);
  }

  function daysForMonth(d) {
    const start = startOfMonth(d);
    const res = [];
    const firstDay = start.getDay();
    // fill previous month blanks
    for (let i = 0; i < firstDay; i++) res.push(null);
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= days; i++) res.push(new Date(d.getFullYear(), d.getMonth(), i));
    return res;
  }

  function iso(d) {
    return d.toISOString().slice(0, 10);
  }

  const days = daysForMonth(month);

  return (
    <div className="calendar">
      <div className="calHeader">
        <button
          className="btn"
          onClick={() => setMonth(addMonth(month, -1))}
        >
          {"<"}
        </button>
        <div className="calTitle">
          {month.toLocaleString(undefined, { month: "long" })} {month.getFullYear()}
        </div>
        <button
          className="btn"
          onClick={() => setMonth(addMonth(month, 1))}
        >
          {">"}
        </button>
      </div>
      <div className="calGrid">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(d => (
          <div
            key={d}
            className="calWeekday"
          >
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d)
            return (
              <div
                key={`b-${i}`}
                className="calCell empty"
              />
            );
          const id = iso(d);
          const available = availableDates.includes(id);
          const isSelected =
            (selectedRange.start && (id === selectedRange.start || id === selectedRange.end)) ||
            (selectedRange.start && selectedRange.end && id >= selectedRange.start && id <= selectedRange.end);
          return (
            <button
              key={id}
              className={`calCell ${available ? "available" : "disabled"} ${isSelected ? "selected" : ""}`}
              onClick={() => onSelect(d)}
              disabled={!available}
            >
              {d.getDate()}
            </button>
          );
        })}
      </div>
    </div>
  );
}
