import React from 'react';

interface DatePickerProps {
  selectedDate: string;
  onDateChange: (date: string) => void;
  availableDates?: string[];
  disabled?: boolean;
}

export function DatePicker({ selectedDate, onDateChange, availableDates, disabled }: DatePickerProps) {
  // Generate last 30 days
  const generateLastMonthDates = () => {
    const dates = [];
    const today = new Date();
    
    for (let i = 0; i < 30; i++) {
      const date = new Date();
      date.setDate(today.getDate() - i);
      dates.push(date.toISOString().split('T')[0]);
    }
    
    return dates;
  };

  const lastMonthDates = generateLastMonthDates();
  const datesToShow = availableDates && availableDates.length > 0 ? availableDates : lastMonthDates;

  const formatDateLabel = (dateStr: string) => {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);

    if (dateStr === today.toISOString().split('T')[0]) {
      return 'Today';
    } else if (dateStr === yesterday.toISOString().split('T')[0]) {
      return 'Yesterday';
    } else {
      return date.toLocaleDateString('en-US', { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric' 
      });
    }
  };

  const isDateAvailable = (dateStr: string) => {
    if (!availableDates || availableDates.length === 0) return true;
    return availableDates.includes(dateStr);
  };

  return (
    <div className="space-y-3">
      <label className="block text-sm font-bold">📅 Select Date</label>
      
      {/* Date Input */}
      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onDateChange(e.target.value)}
        disabled={disabled}
        min={lastMonthDates[lastMonthDates.length - 1]}
        max={lastMonthDates[0]}
        className="nb-input w-full px-4 py-2"
      />

      {/* Quick Date Selection */}
      <div className="space-y-2">
        <p className="text-xs font-bold text-gray-600">Quick Select:</p>
        <div className="grid grid-cols-2 gap-2">
          {lastMonthDates.slice(0, 8).map((date) => (
            <button
              key={date}
              onClick={() => onDateChange(date)}
              disabled={disabled || !isDateAvailable(date)}
              className={`px-3 py-2 text-xs font-bold rounded ${
                selectedDate === date
                  ? 'nb-panel-accent'
                  : isDateAvailable(date)
                  ? 'nb-button'
                  : 'nb-panel opacity-50 cursor-not-allowed'
              }`}
            >
              {formatDateLabel(date)}
              {!isDateAvailable(date) && availableDates && (
                <span className="block text-xs text-gray-500">No data</span>
              )}
            </button>
          ))}
        </div>
      </div>

      {availableDates && availableDates.length > 0 && (
        <p className="text-xs text-gray-500">
          {availableDates.length} day{availableDates.length !== 1 ? 's' : ''} of data available
        </p>
      )}
    </div>
  );
}