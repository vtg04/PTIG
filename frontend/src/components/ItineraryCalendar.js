import React from 'react';
import { Calendar } from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

const ItineraryCalendar = ({ activities }) => {
  const tileContent = ({ date, view }) => {
    if (view === 'month') {
      const dayActivities = activities.filter(activity => {
        const activityDate = new Date(activity.date);
        return activityDate.toDateString() === date.toDateString();
      });
      return (
        <ul>
          {dayActivities.map((activity, index) => (
            <li key={index}>{activity.name}</li>
          ))}
        </ul>
      );
    }
  };

  return (
    <Calendar
      tileContent={tileContent}
    />
  );
};

export default ItineraryCalendar;
