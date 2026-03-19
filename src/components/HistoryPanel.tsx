"use client";

import { Clock, Trash2 } from "lucide-react";

type Calculation = {
  id: number;
  expression: string;
  result: string;
  timestamp: string;
};

interface HistoryPanelProps {
  history: Calculation[];
  loading: boolean;
}

export default function HistoryPanel({ history, loading }: HistoryPanelProps) {
  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString();
  };

  const clearHistory = async () => {
    if (!confirm("Clear all history?")) return;
    try {
      const response = await fetch("/api/history", { method: "DELETE" });
      if (response.ok) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error clearing history:", error);
    }
  };

  return (
    <div className="bg-gray-900 rounded-2xl p-6 shadow-2xl border border-gray-800 h-full">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Clock size={24} />
          Calculation History
        </h2>
        <button
          onClick={clearHistory}
          className="flex items-center gap-2 bg-red-700 hover:bg-red-600 px-4 py-2 rounded-lg transition-colors"
          disabled={history.length === 0}
        >
          <Trash2 size={18} />
          Clear All
        </button>
      </div>
      {loading ? (
        <div className="text-center py-10">
          <div className="inline-block animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
          <p className="mt-2 text-gray-400">Loading history...</p>
        </div>
      ) : history.length === 0 ? (
        <div className="text-center py-10 text-gray-500">
          <p>No calculations yet.</p>
          <p className="text-sm mt-2">Perform calculations to see them here.</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2">
          {history.map((calc) => (
            <div
              key={calc.id}
              className="bg-gray-800 rounded-xl p-4 border border-gray-700 hover:border-gray-600 transition-colors"
            >
              <div className="flex justify-between items-start mb-2">
                <div className="font-mono text-lg truncate">{calc.expression}</div>
                <div className="text-green-400 font-bold text-xl">{calc.result}</div>
              </div>
              <div className="flex justify-between text-gray-400 text-sm">
                <div>ID: {calc.id}</div>
                <div className="flex items-center gap-2">
                  <span>{formatDate(calc.timestamp)}</span>
                  <span>•</span>
                  <span>{formatTime(calc.timestamp)}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
