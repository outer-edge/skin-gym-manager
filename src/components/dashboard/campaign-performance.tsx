"use client";

const campaigns = [
  {
    name: "Instagram Summer",
    spend: 2500,
    revenue: 12800,
    roi: 4.12,
    members: 23,
  },
  {
    name: "Facebook Retargeting",
    spend: 1800,
    revenue: 7200,
    roi: 3.0,
    members: 15,
  },
  {
    name: "Email Newsletter",
    spend: 500,
    revenue: 3500,
    roi: 6.0,
    members: 8,
  },
];

export function CampaignPerformance() {
  return (
    <div className="space-y-4">
      {campaigns.map((campaign) => (
        <div key={campaign.name} className="space-y-2">
          <div className="flex justify-between items-center">
            <h4 className="font-medium">{campaign.name}</h4>
            <span className="text-sm font-semibold text-green-600">
              {campaign.roi}x ROI
            </span>
          </div>
          <div className="grid grid-cols-3 gap-2 text-sm">
            <div>
              <p className="text-gray-500">Spend</p>
              <p className="font-medium">${campaign.spend}</p>
            </div>
            <div>
              <p className="text-gray-500">Revenue</p>
              <p className="font-medium">${campaign.revenue}</p>
            </div>
            <div>
              <p className="text-gray-500">Members</p>
              <p className="font-medium">{campaign.members}</p>
            </div>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-gradient-to-r from-purple-600 to-pink-600 h-2 rounded-full"
              style={{ width: `${Math.min(campaign.roi * 20, 100)}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}