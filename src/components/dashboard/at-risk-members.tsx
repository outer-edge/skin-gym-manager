"use client";

import { useState } from "react";

const mockMembers = [
  {
    id: 1,
    name: "Emma Davis",
    riskLevel: "CRITICAL",
    lastVisit: "45 days ago",
    lastPurchase: "92 days ago",
    email: "emma.davis@email.com",
  },
  {
    id: 2,
    name: "Michael Chen",
    riskLevel: "HIGH",
    lastVisit: "32 days ago",
    lastPurchase: "67 days ago",
    email: "michael.chen@email.com",
  },
  {
    id: 3,
    name: "Sarah Johnson",
    riskLevel: "HIGH",
    lastVisit: "28 days ago",
    lastPurchase: "45 days ago",
    email: "sarah.j@email.com",
  },
];

export function AtRiskMembersList() {
  const [selectedMember, setSelectedMember] = useState<number | null>(null);

  return (
    <div className="space-y-4">
      {mockMembers.map((member) => (
        <div
          key={member.id}
          className="p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
          onClick={() => setSelectedMember(member.id)}
        >
          <div className="flex items-center justify-between">
            <div>
              <h4 className="font-semibold">{member.name}</h4>
              <p className="text-sm text-gray-600">{member.email}</p>
            </div>
            <div className="text-right">
              <span
                className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${
                  member.riskLevel === "CRITICAL"
                    ? "bg-red-100 text-red-800"
                    : "bg-yellow-100 text-yellow-800"
                }`}
              >
                {member.riskLevel}
              </span>
            </div>
          </div>
          <div className="mt-2 flex gap-4 text-sm text-gray-500">
            <span>Last visit: {member.lastVisit}</span>
            <span>Last purchase: {member.lastPurchase}</span>
          </div>
          {selectedMember === member.id && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm font-semibold mb-2">Recommended Actions:</p>
              <ul className="text-sm space-y-1">
                <li>• Send personalized re-engagement email</li>
                <li>• Offer exclusive retention discount</li>
                <li>• Schedule a personal check-in call</li>
              </ul>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}