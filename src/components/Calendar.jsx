import { useState } from 'react';
import { CALENDAR_WEEKDAYS } from '../utils/env';

export default function Calendar({ availableDates, onSelect, selectedRange }) {
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
    for (let i = 0; i < firstDay; i++) res.push(null);
    const days = new Date(d.getFullYear(), d.getMonth() + 1, 0).getDate();
    for (let i = 1; i <= days; i++) {
      res.push(new Date(d.getFullYear(), d.getMonth(), i));
    }
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
          className="btn btn-sm"
          onClick={() => setMonth(addMonth(month, -1))}
        >
          {'<'}
        </button>
        <div className="calTitle">
          {month.toLocaleString('cs-CZ', { month: 'long' })} {month.getFullYear()}
        </div>
        <button
          className="btn btn-sm"
          onClick={() => setMonth(addMonth(month, 1))}
        >
          {'>'}
        </button>
      </div>
      <div className="calGrid">
        {CALENDAR_WEEKDAYS.map((d, i) => (
          <div key={`weekday-${i}`} className="calWeekday">
            {d}
          </div>
        ))}
        {days.map((d, i) => {
          if (!d) return <div key={`b-${i}`} className="calCell empty" />;
          const id = iso(d);
          const available = availableDates.includes(id);
          const isSelected =
            (selectedRange.start && (id === selectedRange.start || id === selectedRange.end)) ||
            (selectedRange.start && selectedRange.end && id >= selectedRange.start && id <= selectedRange.end);
          return (
            <button
              key={id}
              className={`calCell ${available ? 'available' : 'disabled'} ${isSelected ? 'selected' : ''}`}
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
