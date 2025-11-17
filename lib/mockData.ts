import { Opportunity } from './types';

export const mockOpportunities: Opportunity[] = [
  {
    id: '1',
    title: 'MicroTymp Replacement Units',
    company: 'Regional Hospital Network',
    value: 2600,
    probability: 85,
    stage: 'negotiation',
    source: 'Existing Customer',
    contact: {
      name: 'Dr. Sarah Johnson',
      email: 'sjohnson@regionalhospital.com',
      phone: '(555) 123-4567'
    },
    closeDate: '2025-11-15',
    lastActivity: '2025-11-01',
    nextAction: 'Send final quote with volume discount',
    tags: ['Hot Lead', 'Existing Customer', 'Equipment'],
    notes: 'Customer needs 2 replacement units for aging equipment. Budget approved.'
  },
  {
    id: '2',
    title: 'Enterprise Audiology Suite',
    company: 'Metro Health Systems',
    value: 45000,
    probability: 60,
    stage: 'proposal',
    source: 'Trade Show',
    contact: {
      name: 'Michael Chen',
      email: 'mchen@metrohealth.com',
      phone: '(555) 234-5678'
    },
    closeDate: '2025-12-20',
    lastActivity: '2025-10-28',
    nextAction: 'Schedule product demo with decision makers',
    tags: ['Large Deal', 'New Customer', 'Software'],
    notes: 'Looking to upgrade entire audiology department. 5 locations.'
  },
  {
    id: '3',
    title: 'Portable Screening Equipment',
    company: 'School District 42',
    value: 8500,
    probability: 40,
    stage: 'discovery',
    source: 'Inbound Lead',
    contact: {
      name: 'Jennifer Martinez',
      email: 'jmartinez@sd42.edu',
      phone: '(555) 345-6789'
    },
    closeDate: '2026-01-30',
    lastActivity: '2025-10-25',
    nextAction: 'Send information packet and case studies',
    tags: ['Education', 'New Customer', 'Equipment'],
    notes: 'Annual screening program for 12 schools. Grant funding pending.'
  },
  {
    id: '4',
    title: 'Tympanometry Training Program',
    company: 'Coastal Audiology Group',
    value: 3200,
    probability: 75,
    stage: 'negotiation',
    source: 'Referral',
    contact: {
      name: 'Dr. Robert Williams',
      email: 'rwilliams@coastalaud.com',
      phone: '(555) 456-7890'
    },
    closeDate: '2025-11-10',
    lastActivity: '2025-10-30',
    nextAction: 'Finalize training schedule and contract',
    tags: ['Training', 'Existing Customer', 'Services'],
    notes: 'On-site training for 8 staff members. Equipment purchase to follow.'
  },
  {
    id: '5',
    title: 'Diagnostic Equipment Upgrade',
    company: 'University Medical Center',
    value: 28000,
    probability: 55,
    stage: 'proposal',
    source: 'Cold Outreach',
    contact: {
      name: 'Dr. Amanda Foster',
      email: 'afoster@umc.edu',
      phone: '(555) 567-8901'
    },
    closeDate: '2025-12-15',
    lastActivity: '2025-10-29',
    nextAction: 'Present ROI analysis to procurement committee',
    tags: ['Large Deal', 'New Customer', 'Equipment'],
    notes: 'Replacing 10-year-old equipment. Competing with 2 other vendors.'
  }
];
