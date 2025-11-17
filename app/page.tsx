'use client';  
  
import { useState, useMemo, useEffect } from 'react';  
import Header from './components/Header';  
import StatsCards from './components/StatsCards';  
import FilterPanel from './components/FilterPanel';  
import OpportunityCard from './components/OpportunityCard';  
import { FilterState, Stats } from '@/lib/types';  
  
export default function Home() {  
  const [opportunities, setOpportunities] = useState([]);  
  const [stats, setStats] = useState<Stats>({ totalOpportunities: 0, totalValue: 0, expectedRevenue: 0, avgProbability: 0 });  
  const [isLoading, setIsLoading] = useState(true);  
  const [filters, setFilters] = useState<FilterState>({ search: '', stage: '', source: '', sortBy: 'value' });  
  
  useEffect(()  => {  
    fetch('/api/opportunities')  
      .then(res => res.json())  
      .then(data => {  
        setOpportunities(data.opportunities);  
        setStats(data.stats);  
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
  
  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><p>Loading opportunities...</p></div>;  
  
  return (  
    <div className="min-h-screen bg-gray-50">  
      <Header />  
      <main className="max-w-7xl mx-auto px-6 py-8">  
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
      </main>  
    </div>  
  );  
} 
