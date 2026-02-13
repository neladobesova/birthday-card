import { useState } from "react";
import {
  GIFT_TEXT,
  GIFT_SUBTITLE,
  GIFT_DATE_TITLE,
  GIFT_OPEN_CALENDAR,
  GIFT_SELECTED_DATE_LABEL,
  GIFT_CANCEL_BUTTON,
  GIFT_CONFIRM_BUTTON,
  getDestinations,
} from "../utils/env";
import DestinationCard from "./DestinationCard";
import Calendar from "./Calendar";

export default function GiftSection({ availableDates, unavailableDates, onDateSelect, onLinkClick, onCalendarOpen }) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [weekend, setWeekend] = useState("");

  const destinations = getDestinations();

  const getInitialRange = () => {
    const isFriSatSun = dateStr => {
      const d = new Date(dateStr);
      const w = d.getDay();
      return w === 5 || w === 6 || w === 0;
    };

    const formatISO = d => {
      const y = d.getFullYear();
      const m = String(d.getMonth() + 1).padStart(2, "0");
      const day = String(d.getDate()).padStart(2, "0");
      return `${y}-${m}-${day}`;
    };

    if (Array.isArray(availableDates) && availableDates.length > 0) {
      const first = availableDates.find(d => isFriSatSun(d) && !(unavailableDates || []).includes(d)) || null;
      return { start: first, end: null };
    }
    const year = new Date().getFullYear();
    for (let day = 1; day <= 31; day++) {
      const dt = new Date(year, 2, day);
      if (dt.getMonth() !== 2) break;
      const iso = formatISO(dt);
      if ((dt.getDay() === 5 || dt.getDay() === 6 || dt.getDay() === 0) && !(unavailableDates || []).includes(iso)) {
        return { start: iso, end: null };
      }
    }
    return { start: null, end: null };
  };

  const [selectedRange, setSelectedRange] = useState(getInitialRange());

  const handleCalendarSelect = day => {
    const iso = formatISO(day);
    // only allow selecting Friday (5), Saturday (6) or Sunday (0)
    const w = day.getDay();
    if (!(w === 5 || w === 6 || w === 0)) return;
    if (unavailableDates && unavailableDates.includes(iso)) return;
    const hasExplicitAvailable = Array.isArray(availableDates) && availableDates.length > 0;
    if (hasExplicitAvailable && !availableDates.includes(iso)) return;

    const { start, end } = selectedRange;

    // If the user clicked a Friday, auto-select Friday->Sunday when possible.
    if (w === 5) {
      const candidates = [0, 1, 2].map(i => {
        const d = new Date(day);
        d.setDate(d.getDate() + i);
        return formatISO(d);
      });

      const allowed = candidates.filter(d => {
        if (unavailableDates && unavailableDates.includes(d)) return false;
        if (hasExplicitAvailable && !availableDates.includes(d)) return false;
        // allow if not explicitly disallowed
        return true;
      });

      if (allowed.length === 3) {
        setSelectedRange({ start: allowed[0], end: allowed[2] });
        return;
      }

      if (allowed.length > 1) {
        setSelectedRange({ start: allowed[0], end: allowed[allowed.length - 1] });
        return;
      }

      // only Friday allowed (or none) — set single-day selection
      setSelectedRange({ start: allowed[0] || iso, end: null });
      return;
    }

    const fridayOf = d => {
      const copy = new Date(d);
      const wd = copy.getDay();
      const off = (wd + 2) % 7; // Fri->0, Sat->1, Sun->2
      const fr = new Date(Date.UTC(copy.getFullYear(), copy.getMonth(), copy.getDate()));
      fr.setUTCDate(fr.getUTCDate() - off);
      return Date.UTC(fr.getUTCFullYear(), fr.getUTCMonth(), fr.getUTCDate());
    };

    const utcDaysBetween = (aStr, bStr) => {
      const a = new Date(aStr);
      const b = new Date(bStr);
      return Math.round(
        (Date.UTC(b.getFullYear(), b.getMonth(), b.getDate()) - Date.UTC(a.getFullYear(), a.getMonth(), a.getDate())) /
          86400000,
      );
    };

    if (!start || (start && end)) {
      setSelectedRange({ start: iso, end: null });
      return;
    }

    // start exists and end is null
    const startFriday = fridayOf(new Date(start));
    const clickFriday = fridayOf(day);
    if (startFriday !== clickFriday) {
      // different weekend -> start new selection
      setSelectedRange({ start: iso, end: null });
      return;
    }

    if (iso === start) return;

    if (iso > start) {
      const days = utcDaysBetween(start, iso);
      const capped = Math.min(days, 2);
      const endDate = new Date(start);
      endDate.setDate(endDate.getDate() + capped);
      setSelectedRange({ start, end: formatISO(endDate) });
      return;
    }

    // clicked before start within same weekend
    const daysBack = utcDaysBetween(iso, start);
    const cappedBack = Math.min(daysBack, 2);
    const newStartDate = new Date(iso);
    const potentialEnd = new Date(newStartDate);
    potentialEnd.setDate(newStartDate.getDate() + cappedBack);
    setSelectedRange({ start: formatISO(newStartDate), end: formatISO(potentialEnd) });
    return;
  };

  const confirmSelectedWeekend = () => {
    if (!selectedRange.start) return;
    const weekendStr = selectedRange.end ? `${selectedRange.start} to ${selectedRange.end}` : selectedRange.start;
    setWeekend(weekendStr);
    setConfirmed(true);
    setShowCalendar(false);
    onDateSelect(weekendStr);
  };

  function formatISO(d) {
    const y = d.getFullYear();
    const m = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${y}-${m}-${day}`;
  }

  return (
    <div className="min-h-screen bg-linear-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">{GIFT_TEXT} 🎁</h2>
          <p className="text-xl text-gray-600">{GIFT_SUBTITLE}</p>
        </div>

        <div className="destination-grid">
          {destinations.map(dest => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">{GIFT_DATE_TITLE}</h3>

          {!showCalendar && (
            <div className="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => {
                  setShowCalendar(true);
                  if (onCalendarOpen) {
                    onCalendarOpen();
                  }
                }}
              >
                {GIFT_OPEN_CALENDAR}
              </button>
              {confirmed && (
                <p className="mt-4 text-green-600 font-semibold">
                  {GIFT_SELECTED_DATE_LABEL} {weekend}
                </p>
              )}
            </div>
          )}

          {showCalendar && (
            <div>
              <Calendar
                availableDates={availableDates}
                unavailableDates={unavailableDates}
                onSelect={handleCalendarSelect}
                selectedRange={selectedRange}
              />
              <div className="flex gap-4 justify-end mt-6">
                <button
                  className="btn btn-outline"
                  onClick={() => {
                    setShowCalendar(false);
                    setSelectedRange({ start: null, end: null });
                  }}
                >
                  {GIFT_CANCEL_BUTTON}
                </button>
                <button
                  className="btn btn-primary"
                  onClick={confirmSelectedWeekend}
                  disabled={!selectedRange.start}
                >
                  {GIFT_CONFIRM_BUTTON}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
