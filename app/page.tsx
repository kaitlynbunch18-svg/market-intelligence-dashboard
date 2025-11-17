'use client';

import { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import StatsCards from './components/StatsCards';
import FilterPanel from './components/FilterPanel';
import OpportunityCard from './components/OpportunityCard';
import { FilterState, Stats } from '@/lib/types';

export default function Home() {
  const [activeTab, setActiveTab] = useState('opportunities');
  const [opportunities, setOpportunities] = useState([]);
  const [stats, setStats] = useState<Stats>({ totalOpportunities: 0, totalValue: 0, expectedRevenue: 0, avgProbability: 0 });
  const [businessStats, setBusinessStats] = useState<any>(null);
  const [myOrders, setMyOrders] = useState([]);
  const [myListings, setMyListings] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ search: '', stage: '', source: '', sortBy: 'value' });

  useEffect(()  => {
    Promise.all([
      fetch('/api/opportunities').then(res => res.json()),
      fetch('/api/business-stats').then(res => res.json()),
      fetch('/api/my-orders').then(res => res.json()),
      fetch('/api/my-listings').then(res => res.json())
    ])
      .then(([oppData, statsData, ordersData, listingsData]) => {
        setOpportunities(oppData.opportunities);
        setStats(oppData.stats);
        setBusinessStats(statsData);
        setMyOrders(ordersData);
        setMyListings(listingsData);
        setIsLoading(false);
      })
      .catch(err => { console.error(err); setIsLoading(false); });
  }, []);

  const filteredOpportunities = useMemo(() => {
    let filtered = [...opportunities];
    if (filters.search) {
      const searchLower = filters.search.toLowerCase();
      filtered = filtered.filter(opp => opp.title.toLowerCase().includes(searchLower) || opp.company.toLowerCase().includes(searchLower) || opp.contact.name.toLowerCase().includes(searchLower));
    }
    if (filters.stage) filtered = filtered.filter(opp => opp.stage === filters.stage);
    if (filters.source) filtered = filtered.filter(opp => opp.source === filters.source);
    filtered.sort((a, b) => {
      switch (filters.sortBy) {
        case 'value': return b.value - a.value;
        case 'probability': return b.probability - a.probability;
        case 'closeDate': return new Date(a.closeDate).getTime() - new Date(b.closeDate).getTime();
        default: return 0;
      }
    });
    return filtered;
  }, [opportunities, filters]);

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading...</p></div>;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-6 border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('opportunities')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'opportunities'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Buying Opportunities
            </button>
            <button
              onClick={() => setActiveTab('business')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'business'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              My Business
            </button>
          </nav>
        </div>

        {activeTab === 'opportunities' && (
          <>
            <StatsCards stats={stats} />
            <FilterPanel filters={filters} onFilterChange={setFilters} />
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredOpportunities.map((opportunity) => (
                <OpportunityCard key={opportunity.id} opportunity={opportunity} />
              ))}
            </div>
            {filteredOpportunities.length === 0 && (
              <div className="text-center py-12"><p className="text-gray-500 text-lg">No opportunities found matching your filters.</p></div>
            )}
          </>
        )}

        {activeTab === 'business' && businessStats && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Orders</h3>
                <p className="text-3xl font-bold text-gray-900 mt-2">{businessStats.orders.total_orders}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Total Revenue</h3>
                <p className="text-3xl font-bold text-green-600 mt-2">${businessStats.orders.total_revenue.toFixed(2)}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Active Listings</h3>
                <p className="text-3xl font-bold text-blue-600 mt-2">{businessStats.listings.active_listings}</p>
              </div>
              <div className="bg-white rounded-lg shadow p-6">
                <h3 className="text-sm font-medium text-gray-500">Avg Price</h3>
                <p className="text-3xl font-bold text-purple-600 mt-2">${businessStats.listings.avg_price.toFixed(2)}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Order ID</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Buyer</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Amount</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myOrders.slice(0, 10).map((order: any) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{order.order_id}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.buyer_username}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-green-600">${parseFloat(order.total_amount).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{order.order_status}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="bg-white rounded-lg shadow">
                <div className="px-6 py-4 border-b border-gray-200">
                  <h2 className="text-lg font-semibold text-gray-900">Top Listings</h2>
                </div>
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {myListings.slice(0, 10).map((listing: any) => (
                        <tr key={listing.id}>
                          <td className="px-6 py-4 text-sm text-gray-900 max-w-xs truncate">{listing.title}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">${parseFloat(listing.current_price).toFixed(2)}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.views}</td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{listing.quantity_available}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
} 
