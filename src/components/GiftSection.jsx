import { useState } from 'react';
import {
  GIFT_TEXT,
  GIFT_SUBTITLE,
  GIFT_DATE_TITLE,
  GIFT_OPEN_CALENDAR,
  GIFT_SELECTED_DATE_LABEL,
  GIFT_CANCEL_BUTTON,
  GIFT_CONFIRM_BUTTON,
  getDestinations,
} from '../utils/env';
import DestinationCard from './DestinationCard';
import Calendar from './Calendar';

export default function GiftSection({
  availableDates,
  onDateSelect,
  onLinkClick
}) {
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedRange, setSelectedRange] = useState({ start: null, end: null });
  const [confirmed, setConfirmed] = useState(false);
  const [weekend, setWeekend] = useState('');

  const destinations = getDestinations();

  const handleCalendarSelect = (day) => {
    const iso = formatISO(day);
    if (!availableDates.includes(iso)) return;

    const { start, end } = selectedRange;
    if (!start || (start && end)) {
      setSelectedRange({ start: iso, end: null });
    } else if (start && !end) {
      if (iso >= start) setSelectedRange({ start, end: iso });
      else setSelectedRange({ start: iso, end: start });
    }
  };

  const confirmSelectedWeekend = () => {
    if (!selectedRange.start || !selectedRange.end) return;
    const weekendStr = `${selectedRange.start} to ${selectedRange.end}`;
    setWeekend(weekendStr);
    setConfirmed(true);
    setShowCalendar(false);
    onDateSelect(weekendStr);
  };

  function formatISO(d) {
    return d.toISOString().slice(0, 10);
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 to-purple-50 py-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-12 animate-slide-up">
          <h2 className="text-4xl md:text-5xl font-bold mb-4">
            {GIFT_TEXT} 🎁
          </h2>
          <p className="text-xl text-gray-600">
            {GIFT_SUBTITLE}
          </p>
        </div>

        <div className="destination-grid">
          {destinations.map((dest) => (
            <DestinationCard
              key={dest.id}
              destination={dest}
              onLinkClick={onLinkClick}
            />
          ))}
        </div>

        <div className="mt-12 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold mb-6 text-center">
            {GIFT_DATE_TITLE}
          </h3>

          {!showCalendar && (
            <div className="text-center">
              <button
                className="btn btn-primary btn-lg"
                onClick={() => setShowCalendar(true)}
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
                  disabled={!selectedRange.start || !selectedRange.end}
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
