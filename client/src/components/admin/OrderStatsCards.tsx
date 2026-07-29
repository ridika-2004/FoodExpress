import { Clock, Bike, CheckCircle, Package } from 'lucide-react';

interface OrderStats {
  pending: number;
  delivering: number;
  delivered: number;
  unassigned: number;
}

interface OrderStatsCardsProps {
  stats: OrderStats;
}

export default function OrderStatsCards({ stats }: OrderStatsCardsProps) {
  const cards = [
    {
      label: 'Pending',
      value: stats.pending,
      icon: Clock,
      color: 'bg-yellow-50 text-yellow-600',
    },
    {
      label: 'Delivering',
      value: stats.delivering,
      icon: Bike,
      color: 'bg-primary/5 text-primary',
    },
    {
      label: 'Delivered',
      value: stats.delivered,
      icon: CheckCircle,
      color: 'bg-green-50 text-green-600',
    },
    {
      label: 'Unassigned',
      value: stats.unassigned,
      icon: Package,
      color: stats.unassigned > 0 ? 'bg-red-50 text-red-500' : 'bg-muted text-foreground-muted',
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
      {cards.map(card => (
        <div key={card.label} className="bg-white border border-border rounded-2xl p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs text-foreground-muted font-medium">{card.label}</p>
              <p className={`text-2xl font-bold mt-1 ${card.label === 'Unassigned' && stats.unassigned > 0 ? 'text-red-500' : 'text-foreground'}`}>
                {card.value}
              </p>
            </div>
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${card.color}`}>
              <card.icon size={20} />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}