import React from 'react';
import { CalendarCheck } from 'lucide-react';

interface EntryCountProps {
  count: number;
  total: number;
}

export function EntryCount({ count, total }: EntryCountProps) {
  return (
    <div className="mt-4 p-4 bg-white rounded-lg shadow">
      <div className="flex items-center gap-2 text-gray-700">
        <CalendarCheck className="w-5 h-5 text-green-500" />
        <span className="font-medium">Monthly Progress</span>
      </div>
      <p className="mt-2 text-2xl font-bold text-green-500">{count} / {total}</p>
      <p className="text-sm text-gray-500">days journaled this month</p>
    </div>
  );
}