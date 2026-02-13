import { useState } from "react";
import { CALENDAR_WEEKDAYS } from "../utils/env";

export default function Calendar({ availableDates, unavailableDates, onSelect, selectedRange }) {
  const [month, setMonth] = useState(() => {
    if (availableDates && availableDates.length > 0) {
      const d = new Date(availableDates[0]);
      d.setDate(1);
      return d;
    }
    // Default to March of current year
    return new Date(new Date().getFullYear(), 2, 1);
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
    const leadingBlanks = (firstDay + 6) % 7; // shift so Monday is first
    for (let i = 0; i < leadingBlanks; i++) res.push(null);
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= days; i++) {
      res.push(new Date(d.getFullYear(), d.getMonth(), i));
    }
    return res;
  }

  function iso(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  const days = daysForMonth(month);

  return (
    <div className="calendar">
      <div className="calHeader">
        <button
          className="btn btn-sm"
          onClick={() => setMonth(addMonth(month, -1))}
        >
          {"<"}
        </button>
        <div className="calTitle">
          {month.toLocaleString("cs-CZ", { month: "long" })} {month.getFullYear()}
        </div>
        <button
          className="btn btn-sm"
          onClick={() => setMonth(addMonth(month, 1))}
        >
          {">"}
        </button>
      </div>
      <div className="calGrid">
        {(() => {
          const weekdays = CALENDAR_WEEKDAYS.slice(1).concat(CALENDAR_WEEKDAYS[0]); // start with Monday
          return weekdays.map((d, i) => (
            <div
              key={`weekday-${i}`}
              className="calWeekday"
            >
              {d}
            </div>
          ));
        })()}
        {days.map((d, i) => {
          if (!d)
            return (
              <div
                key={`b-${i}`}
                className="calCell empty"
              />
            );
          const id = iso(d);
          const dayIndex = d.getDay();
          const isFriSatSun = dayIndex === 5 || dayIndex === 6 || dayIndex === 0;
          const isUnavailable = unavailableDates && unavailableDates.includes(id);
          // only allow selection on Friday, Saturday or Sunday
          // If `availableDates` is provided and non-empty we require the date to be listed there;
          // otherwise allow any Fri/Sat/Sun except those explicitly unavailable.
          const hasExplicitAvailable = Array.isArray(availableDates) && availableDates.length > 0;
          const available = !isUnavailable && isFriSatSun && (!hasExplicitAvailable || availableDates.includes(id));
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
