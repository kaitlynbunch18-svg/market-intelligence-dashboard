import { Calendar, Mail, Phone, Tag, AlertCircle } from 'lucide-react';
import { Opportunity } from '@/lib/types';
import { format } from 'date-fns';

interface OpportunityCardProps {
  opportunity: Opportunity;
}

const stageColors = {
  discovery: 'bg-blue-100 text-blue-800',
  proposal: 'bg-yellow-100 text-yellow-800',
  negotiation: 'bg-orange-100 text-orange-800',
  'closed-won': 'bg-green-100 text-green-800',
  'closed-lost': 'bg-red-100 text-red-800'
};

export default function OpportunityCard({ opportunity }: OpportunityCardProps) {
  return (
    <div className="bg-white rounded-lg shadow hover:shadow-lg transition-shadow p-6">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-lg font-semibold text-gray-900 mb-1">{opportunity.title}</h3>
          <p className="text-sm text-gray-600">{opportunity.company}</p>
        </div>
        <span className={`px-3 py-1 rounded-full text-xs font-medium ${stageColors[opportunity.stage]}`}>
          {opportunity.stage.replace('-', ' ').toUpperCase()}
        </span>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div>
          <p className="text-sm text-gray-500">Value</p>
          <p className="text-xl font-bold text-gray-900">${opportunity.value.toLocaleString()}</p>
        </div>
        <div>
          <p className="text-sm text-gray-500">Probability</p>
          <p className="text-xl font-bold text-gray-900">{opportunity.probability}%</p>
        </div>
      </div>

      <div className="space-y-2 mb-4">
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Calendar className="w-4 h-4" />
          <span>Close Date: {format(new Date(opportunity.closeDate), 'MMM dd, yyyy')}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Mail className="w-4 h-4" />
          <span>{opportunity.contact.email}</span>
        </div>
        <div className="flex items-center gap-2 text-sm text-gray-600">
          <Phone className="w-4 h-4" />
          <span>{opportunity.contact.phone}</span>
        </div>
      </div>

      <div className="mb-4">
        <div className="flex items-start gap-2 text-sm">
          <AlertCircle className="w-4 h-4 text-orange-500 mt-0.5" />
          <div>
            <p className="font-medium text-gray-700">Next Action:</p>
            <p className="text-gray-600">{opportunity.nextAction}</p>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {opportunity.tags.map((tag) => (
          <span key={tag} className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-700 rounded text-xs">
            <Tag className="w-3 h-3" />
            {tag}
          </span>
        ))}
      </div>

      <div className="mt-4 pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">Source: {opportunity.source}</p>
        <p className="text-xs text-gray-500">Contact: {opportunity.contact.name}</p>
      </div>
    </div>
  );
}
