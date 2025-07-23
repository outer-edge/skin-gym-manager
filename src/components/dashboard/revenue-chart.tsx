"use client";

export function RevenueChart() {
  const data = [
    { month: "Jan", revenue: 42000 },
    { month: "Feb", revenue: 38000 },
    { month: "Mar", revenue: 45000 },
    { month: "Apr", revenue: 44000 },
    { month: "May", revenue: 48000 },
    { month: "Jun", revenue: 52000 },
  ];

  const maxRevenue = Math.max(...data.map(d => d.revenue));

  return (
    <div className="h-64">
      <div className="flex items-end justify-between h-full gap-4">
        {data.map((item) => (
          <div key={item.month} className="flex-1 flex flex-col items-center">
            <div className="w-full bg-gray-200 rounded-t-lg relative flex-1 flex items-end">
              <div
                className="w-full bg-gradient-to-t from-purple-600 to-pink-600 rounded-t-lg transition-all duration-500"
                style={{ height: `${(item.revenue / maxRevenue) * 100}%` }}
              >
                <div className="absolute -top-8 left-0 right-0 text-center text-sm font-semibold">
                  ${(item.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            </div>
            <p className="mt-2 text-sm text-gray-600">{item.month}</p>
          </div>
        ))}
      </div>
    </div>
  );
}