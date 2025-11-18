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
  const [allProducts, setAllProducts] = useState([]);
  const [productsPage, setProductsPage] = useState(1);
  const [productsPerPage] = useState(50);
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState<FilterState>({ search: '', stage: '', source: '', sortBy: 'value' });

  useEffect(()  => {
    Promise.all([
      fetch('/api/opportunities').then(res => res.json()),
      fetch('/api/business-stats').then(res => res.json()),
      fetch('/api/my-orders').then(res => res.json()),
      fetch('/api/my-listings').then(res => res.json()),
      fetch('/api/products').then(res => res.json())
    ])
      .then(([oppData, statsData, ordersData, listingsData, productsData]) => {
        setOpportunities(oppData.opportunities);
        setStats(oppData.stats);
        setBusinessStats(statsData);
        setMyOrders(ordersData);
        setMyListings(listingsData);
        setAllProducts(productsData);
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

  const paginatedProducts = useMemo(() => {
    const startIndex = (productsPage - 1) * productsPerPage;
    const endIndex = startIndex + productsPerPage;
    return allProducts.slice(startIndex, endIndex);
  }, [allProducts, productsPage, productsPerPage]);

  const totalProductPages = Math.ceil(allProducts.length / productsPerPage);

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
            <button
              onClick={() => setActiveTab('products')}
              className={`py-4 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'products'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Products ({allProducts.length})
            </button>
          </nav>
        </div>

        {activeTab === 'opportunities' && (
          <>
            {opportunities.length > 0 ? (
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
            ) : (
              <div className="text-center py-16">
                <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <h3 className="mt-2 text-lg font-medium text-gray-900">No opportunities tracked yet</h3>
                <p className="mt-1 text-sm text-gray-500">Connect data sources to begin tracking buying opportunities.</p>
                <div className="mt-6">
                  <button
                    type="button"
                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                  >
                    <svg className="-ml-1 mr-2 h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    New Opportunity
                  </button>
                </div>
                <div className="mt-8 text-left max-w-2xl mx-auto bg-blue-50 rounded-lg p-6">
                  <h4 className="text-sm font-semibold text-blue-900 mb-2">Future Data Sources:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• eBay completed listings analysis</li>
                    <li>• Market price comparison alerts</li>
                    <li>• Competitor inventory monitoring</li>
                    <li>• Automated opportunity scoring</li>
                  </ul>
                </div>
              </div>
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

        {activeTab === 'products' && (
          <div className="bg-white rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
              <h2 className="text-lg font-semibold text-gray-900">All Products</h2>
              <span className="text-sm text-gray-500">
                Showing {((productsPage - 1) * productsPerPage) + 1}-{Math.min(productsPage * productsPerPage, allProducts.length)} of {allProducts.length}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Title</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Views</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Qty</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {paginatedProducts.map((product: any) => (
                    <tr key={product.id}>
                      <td className="px-6 py-4 text-sm text-gray-900 max-w-md truncate">{product.title}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-blue-600">${parseFloat(product.current_price).toFixed(2)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.views}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{product.quantity_available}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          product.listing_status === 'Active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                        }`}>
                          {product.listing_status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="px-6 py-4 border-t border-gray-200 flex items-center justify-between">
              <div className="flex-1 flex justify-between sm:hidden">
                <button
                  onClick={() => setProductsPage(Math.max(1, productsPage - 1))}
                  disabled={productsPage === 1}
                  className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Previous
                </button>
                <button
                  onClick={() => setProductsPage(Math.min(totalProductPages, productsPage + 1))}
                  disabled={productsPage === totalProductPages}
                  className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Next
                </button>
              </div>
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Page <span className="font-medium">{productsPage}</span> of <span className="font-medium">{totalProductPages}</span>
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => setProductsPage(Math.max(1, productsPage - 1))}
                      disabled={productsPage === 1}
                      className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Previous</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <button
                      onClick={() => setProductsPage(Math.min(totalProductPages, productsPage + 1))}
                      disabled={productsPage === totalProductPages}
                      className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <span className="sr-only">Next</span>
                      <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
} 
