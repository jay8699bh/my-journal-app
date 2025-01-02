import React from 'react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { EntryCount } from './EntryCount';

interface CalendarProps {
  selectedDate: Date;
  onDateSelect: (date: Date) => void;
  entriesMap: Record<string, boolean>;
}

export function Calendar({ selectedDate, onDateSelect, entriesMap }: CalendarProps) {
  const monthStart = startOfMonth(selectedDate);
  const monthEnd = endOfMonth(selectedDate);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  // Calculate entry count for the current month
  const entriesCount = days.reduce((count, day) => {
    const dateStr = format(day, 'yyyy-MM-dd');
    return count + (entriesMap[dateStr] ? 1 : 0);
  }, 0);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg shadow p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            {format(selectedDate, 'MMMM yyyy')}
          </h2>
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
            <div key={day} className="text-center text-sm font-medium text-gray-500">
              {day}
            </div>
          ))}
          {days.map((day) => {
            const dateStr = format(day, 'yyyy-MM-dd');
            const hasEntry = entriesMap[dateStr];
            const isSelected = format(day, 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd');
            
            return (
              <button
                key={day.toString()}
                onClick={() => onDateSelect(day)}
                className={`
                  p-2 text-sm rounded-lg transition-colors
                  ${isSelected
                    ? 'bg-blue-500 text-white'
                    : hasEntry
                    ? 'bg-green-100 hover:bg-green-200 text-green-700'
                    : 'hover:bg-gray-100'
                  }
                `}
              >
                {format(day, 'd')}
              </button>
            );
          })}
        </div>
      </div>
      <EntryCount count={entriesCount} total={days.length} />
    </div>
  );
}