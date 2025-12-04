'use client';
import { useEffect, useState } from 'react';

interface Opportunity {
  id: string;
  title: string;
  price: number;
  url: string;
  opportunity_score: number;
  discovered_at: string;
  keyword: string;
  location: string;
}

export default function Dashboard() {
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/opportunities');
        if (!res.ok) throw new Error('Failed to fetch');
        const data = await res.json();
        setOpportunities(data);
        setError(null);
      } catch (err) {
        setError('Failed to load opportunities');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Market Intelligence Dashboard</h1>
          <p className="text-gray-600">Loading opportunities...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl font-bold mb-8 text-gray-900">Market Intelligence Dashboard</h1>
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Market Intelligence Dashboard</h1>
          <p className="text-gray-600">
            {opportunities.length} opportunities found • Auto-refreshes every 30 seconds
          </p>
        </div>

        {opportunities.length === 0 ? (
          <div className="bg-white rounded-lg shadow p-8 text-center">
            <p className="text-gray-600">No opportunities found yet. The system is scanning...</p>
          </div>
        ) : (
          <div className="grid gap-4">
            {opportunities.map((opp) => (
              <div 
                key={opp.id} 
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{opp.title}</h3>
                    <div className="flex gap-4 text-sm text-gray-600">
                      <span className="font-medium">Keyword: {opp.keyword}</span>
                      <span>Location: {opp.location}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-3xl font-bold text-green-600 mb-1">
                      ${opp.price.toLocaleString()}
                    </div>
                    <div className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-semibold">
                      Score: {opp.opportunity_score}/100
                    </div>
                  </div>
                </div>
                
                <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                  <span className="text-sm text-gray-500">
                    Discovered: {new Date(opp.discovered_at).toLocaleString()}
                  </span>
                  <a 
                    href={opp.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                  >
                    View on eBay →
                  </a>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
