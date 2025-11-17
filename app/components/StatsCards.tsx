import { DollarSign, Target, TrendingUp, Activity } from 'lucide-react';
import { Stats } from '@/lib/types';

interface StatsCardsProps {
  stats: Stats;
}

export default function StatsCards({ stats }: StatsCardsProps) {
  const cards = [
    {
      title: 'Total Opportunities',
      value: stats.totalOpportunities,
      icon: Target,
      color: 'bg-blue-500',
      format: (val: number) => val.toString()
    },
    {
      title: 'Total Pipeline Value',
      value: stats.totalValue,
      icon: DollarSign,
      color: 'bg-green-500',
      format: (val: number) => `$${val.toLocaleString()}`
    },
    {
      title: 'Expected Revenue',
      value: stats.expectedRevenue,
      icon: TrendingUp,
      color: 'bg-purple-500',
      format: (val: number) => `$${val.toLocaleString()}`
    },
    {
      title: 'Avg Probability',
      value: stats.avgProbability,
      icon: Activity,
      color: 'bg-orange-500',
      format: (val: number) => `${val.toFixed(0)}%`
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
      {cards.map((card) => (
        <div key={card.title} className="bg-white rounded-lg shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.color} p-3 rounded-lg`}>
              <card.icon className="w-6 h-6 text-white" />
            </div>
          </div>
          <h3 className="text-sm font-medium text-gray-500 mb-1">{card.title}</h3>
          <p className="text-2xl font-bold text-gray-900">{card.format(card.value)}</p>
        </div>
      ))}
    </div>
  );
}
