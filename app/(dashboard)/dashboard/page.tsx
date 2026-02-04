export default function DashboardPage() {
  const cards = [
    { title: "Pending PRs", value: 12 },
    { title: "RFQs Pending", value: 8 },
    { title: "Approved POs", value: 45 },
    { title: "GRNs Pending QC", value: 6 },
    { title: "Invoices to Match", value: 15 },
  ];

  return (
    <div className="space-y-6">
      
      {/* Title */}
      <div>
        <h2 className="text-xl font-semibold">Dashboard</h2>
        <p className="text-sm text-gray-500">
          Welcome back! Here's your enterprise overview
        </p>
      </div>

      {/* Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        {cards.map((card, i) => (
          <div
            key={i}
            className="bg-white border rounded-lg p-4 shadow-sm"
          >
            <p className="text-sm text-gray-500">{card.title}</p>
            <p className="text-2xl font-semibold mt-1">{card.value}</p>
          </div>
        ))}
      </div>

      {/* Charts Placeholder */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg border h-64">
          <h3 className="font-medium mb-2">Monthly Purchase Spend</h3>
          <div className="h-full flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg border h-64">
          <h3 className="font-medium mb-2">Supplier Performance</h3>
          <div className="h-full flex items-center justify-center text-gray-400">
            Chart Placeholder
          </div>
        </div>
      </div>

      {/* AI Insight */}
      <div className="bg-white border rounded-lg p-4">
        <h4 className="font-semibold mb-1">🤖 AI Insight</h4>
        <p className="text-sm text-gray-600">
          Supplier A shows 15% better delivery consistency this quarter.
          Consider increasing allocation for time-sensitive materials.
        </p>
      </div>

    </div>
  );
}
