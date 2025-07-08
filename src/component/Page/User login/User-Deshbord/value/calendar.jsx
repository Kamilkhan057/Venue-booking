// src/components/ui/calendar.jsx
import React, { useState } from "react";
import { startOfMonth, endOfMonth, startOfWeek, addDays, format, isSameMonth, isSameDay, addMonths, subMonths } from "date-fns";

export const Calendar = ({ selectedDate, onDateChange }) => {
  const [currentMonth, setCurrentMonth] = useState(new Date());

  const handleDateClick = (day) => {
    onDateChange(day);
  };

  const renderHeader = () => (
    <div className="flex justify-between items-center p-4 bg-white shadow-sm rounded-t-lg">
      <button
        onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
        className="text-gray-500 hover:text-gray-900 font-bold"
      >
        ←
      </button>
      <h2 className="text-lg font-semibold text-gray-800">
        {format(currentMonth, "MMMM yyyy")}
      </h2>
      <button
        onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
        className="text-gray-500 hover:text-gray-900 font-bold"
      >
        →
      </button>
    </div>
  );

  const renderDays = () => {
    const days = [];
    const date = new Date();
    const weekDays = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    for (let day of weekDays) {
      days.push(
        <div
          key={day}
          className="text-xs text-center text-gray-600 font-semibold py-2"
        >
          {day}
        </div>
      );
    }
    return <div className="grid grid-cols-7">{days}</div>;
  };

  const renderCells = () => {
    const monthStart = startOfMonth(currentMonth);
    const monthEnd = endOfMonth(monthStart);
    const startDate = startOfWeek(monthStart);

    const rows = [];
    let days = [];
    let day = startDate;

    while (day <= monthEnd) {
      for (let i = 0; i < 7; i++) {
        const formattedDate = format(day, "d");
        const cloneDay = day;
        const isToday = isSameDay(day, new Date());
        const isSelected = selectedDate && isSameDay(day, selectedDate);

        days.push(
          <div
            key={day}
            onClick={() => handleDateClick(cloneDay)}
            className={`cursor-pointer text-sm text-center py-2 rounded-lg transition-all
              ${!isSameMonth(day, monthStart) ? "text-gray-300" : ""}
              ${isToday ? "border border-blue-400" : ""}
              ${isSelected ? "bg-blue-500 text-white" : "hover:bg-blue-100"}`}
          >
            {formattedDate}
          </div>
        );

        day = addDays(day, 1);
      }
      rows.push(<div className="grid grid-cols-7">{days}</div>);
      days = [];
    }

    return <div>{rows}</div>;
  };

  return (
    <div className="w-full max-w-md mx-auto bg-white rounded-lg shadow-md overflow-hidden">
      {renderHeader()}
      {renderDays()}
      {renderCells()}
    </div>
  );
};
