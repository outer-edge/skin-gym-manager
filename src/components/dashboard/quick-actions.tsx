"use client";

import { Plus, Download, Send, Calendar } from "lucide-react";

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <button className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
        <Plus className="h-4 w-4" />
        Add Member
      </button>
      <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
        <Download className="h-4 w-4" />
        Export
      </button>
    </div>
  );
}