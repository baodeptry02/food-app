import React, { useEffect, useState } from "react";

const DateSelector = ({ disabled }) => {
  const [selectedDay, setSelectedDay] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [days, setDays] = useState(Array.from({ length: 31 }, (_, i) => i + 1));

  const getDaysInMonth = (month, year) => new Date(year, month, 0).getDate();

  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  useEffect(() => {
    if (selectedMonth && selectedYear) {
      const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
      setDays(Array.from({ length: daysInMonth }, (_, i) => i + 1));
    }
  }, [selectedMonth, selectedYear]);

  return (
    <div>
      <select
        onChange={(e) => setSelectedYear(e.target.value)}
        value={selectedYear}
        disabled={disabled}
        className="w-auto border border-gray-300 rounded-md xl:px-1 py-2 p-0 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-2"
      >
        <option value="">Select Year</option>
        {years.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedMonth(e.target.value)}
        value={selectedMonth}
        disabled={disabled}
        className="w-auto border border-gray-300 rounded-md xl:px-1 py-2 p-0 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500 mr-2"
      >
        <option value="">Select Month</option>
        {months.map((month) => (
          <option key={month} value={month}>
            {month}
          </option>
        ))}
      </select>

      <select
        onChange={(e) => setSelectedDay(e.target.value)}
        value={selectedDay}
        disabled={disabled}
        className="w-auto border border-gray-300 rounded-md xl:px-1 py-2 p-0 focus:outline-none focus:ring focus:ring-blue-200 dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:focus:ring-blue-500"
      >
        <option value="">Select Day</option>
        {days.map((day) => (
          <option key={day} value={day}>
            {day}
          </option>
        ))}
      </select>
    </div>
  );
};

export default DateSelector;