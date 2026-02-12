# Calendar Scheduler Feature - Implementation Plan

## 🗓️ **Funkce:**
- Výběr data (max 7 týdnů dopředu)
- Výběr hodiny (9:00 - 18:00)
- Timezone aware
- Integrované s Google Calendar

## 📦 **Dependencies:**
```bash
npm install react-calendar date-fns
```

## 🎨 **UI Komponenta:**

```jsx
import { useState } from 'react';
import Calendar from 'react-calendar';
import { format, addWeeks, isWithinInterval } from 'date-fns';

const CalendarScheduler = ({ onSchedule }) => {
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState(null);

  const maxDate = addWeeks(new Date(), 7);
  const minDate = new Date();

  const timeSlots = [
    '09:00', '10:00', '11:00', '12:00', 
    '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
  ];

  const handleDateChange = (date) => {
    setSelectedDate(date);
    setSelectedTime(null); // Reset time
  };

  const handleSchedule = () => {
    if (selectedDate && selectedTime) {
      onSchedule({
        date: format(selectedDate, 'yyyy-MM-dd'),
        time: selectedTime,
        timestamp: new Date(`${format(selectedDate, 'yyyy-MM-dd')}T${selectedTime}:00`)
      });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <label className="block text-sm text-neutral-400 mb-3">
          Vyberte datum:
        </label>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}
          minDate={minDate}
          maxDate={maxDate}
          locale="cs-CZ"
          className="rounded-xl border border-white/10 bg-black/50"
        />
      </div>

      {selectedDate && (
        <div>
          <label className="block text-sm text-neutral-400 mb-3">
            Vyberte čas:
          </label>
          <div className="grid grid-cols-5 gap-2">
            {timeSlots.map((time) => (
              <button
                key={time}
                type="button"
                onClick={() => setSelectedTime(time)}
                className={`py-2 px-3 rounded-lg border transition-all text-sm ${
                  selectedTime === time
                    ? 'bg-[#00D9FF] border-[#00D9FF] text-black font-semibold'
                    : 'bg-black/50 border-white/10 text-neutral-400 hover:border-white/30'
                }`}
              >
                {time}
              </button>
            ))}
          </div>
        </div>
      )}

      {selectedDate && selectedTime && (
        <button
          onClick={handleSchedule}
          className="w-full bg-[#00D9FF] text-black py-3 rounded-xl font-semibold hover:bg-[#00B8D9] transition-all"
        >
          Naplánovat hovor na {format(selectedDate, 'dd.MM.yyyy')} v {selectedTime}
        </button>
      )}
    </div>
  );
};
```

## 🔧 **Backend API:**

```javascript
// /api/schedule-call
export default async function handler(req) {
  const { phone, name, date, time, voiceGender, language } = await req.json();
  
  // 1. Store in database
  await db.collection('scheduled_calls').insertOne({
    phone,
    name,
    scheduledFor: new Date(`${date}T${time}:00`),
    voiceGender,
    language,
    status: 'pending',
    createdAt: new Date(),
  });
  
  // 2. Schedule Twilio call using Cron/Queue
  // 3. Send SMS confirmation
  // 4. Add to Google Calendar
  
  return new Response(JSON.stringify({ success: true }));
}
```

## 📅 **Google Calendar Integration:**

```javascript
import { google } from 'googleapis';

const calendar = google.calendar('v3');
const auth = new google.auth.GoogleAuth({
  keyFile: 'credentials.json',
  scopes: ['https://www.googleapis.com/auth/calendar'],
});

async function addToCalendar({ date, time, phone, name }) {
  const event = {
    summary: `AI Call - ${name}`,
    description: `Scheduled AI call to ${phone}`,
    start: {
      dateTime: `${date}T${time}:00`,
      timeZone: 'Europe/Prague',
    },
    end: {
      dateTime: `${date}T${time}:15`,
      timeZone: 'Europe/Prague',
    },
    reminders: {
      useDefault: false,
      overrides: [
        { method: 'popup', minutes: 10 },
      ],
    },
  };

  await calendar.events.insert({
    auth,
    calendarId: 'primary',
    resource: event,
  });
}
```

## 🚀 **Implementace v App.js:**

Přidat do VoiceCallSection:
- Toggle: "TEĎ" vs "Naplánovat"
- Zobrazit kalendář pokud klient vybere "Naplánovat"
- Uložit scheduled_time do API

## 📝 **TODO (Next Phase):**
- [ ] Install react-calendar
- [ ] Create CalendarScheduler component
- [ ] Add /api/schedule-call endpoint
- [ ] Integrate with Twilio for scheduled calls
- [ ] Google Calendar sync
- [ ] SMS reminders (1 hour before)
