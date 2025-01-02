import React from 'react';
import { BookOpen } from 'lucide-react';

interface JournalHeaderProps {
  title: string;
  onTitleChange: (title: string) => void;
  date: Date;
}

export function JournalHeader({ title, onTitleChange, date }: JournalHeaderProps) {
  return (
    <div className="mb-6 space-y-4">
      <div className="flex items-center gap-3 text-blue-600">
        <BookOpen className="w-6 h-6" />
        <h2 className="text-2xl font-serif">{date.toLocaleDateString('en-US', { 
          weekday: 'long',
          year: 'numeric',
          month: 'long',
          day: 'numeric'
        })}</h2>
      </div>
      <input
        type="text"
        value={title}
        onChange={(e) => onTitleChange(e.target.value)}
        placeholder="Enter a title for your entry..."
        className="w-full px-4 py-2 text-xl font-medium bg-transparent border-b-2 border-gray-200 focus:border-blue-500 focus:outline-none transition-colors"
      />
    </div>
  );
}