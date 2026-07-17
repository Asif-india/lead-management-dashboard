/**
 * Lead Form Options
 *
 * Static dropdown data for the Lead Generate form.
 */

export const countries = [
  { code: 'US', name: 'United States' },
  { code: 'UK', name: 'United Kingdom' },
  { code: 'CA', name: 'Canada' },
  { code: 'AU', name: 'Australia' },
  { code: 'IN', name: 'India' },
  { code: 'DE', name: 'Germany' },
  { code: 'FR', name: 'France' },
  { code: 'JP', name: 'Japan' }
]

export const states = {
  US: [
    { code: 'CA', name: 'California' },
    { code: 'NY', name: 'New York' },
    { code: 'TX', name: 'Texas' },
    { code: 'FL', name: 'Florida' },
    { code: 'IL', name: 'Illinois' }
  ],
  IN: [
    { code: 'MH', name: 'Maharashtra' },
    { code: 'KA', name: 'Karnataka' },
    { code: 'TN', name: 'Tamil Nadu' },
    { code: 'DL', name: 'Delhi' },
    { code: 'GJ', name: 'Gujarat' }
  ],
  UK: [
    { code: 'ENG', name: 'England' },
    { code: 'SCT', name: 'Scotland' },
    { code: 'WLS', name: 'Wales' },
    { code: 'NIR', name: 'Northern Ireland' }
  ]
}

export const cities = {
  CA: [
    { code: 'LA', name: 'Los Angeles' },
    { code: 'SF', name: 'San Francisco' },
    { code: 'SD', name: 'San Diego' },
    { code: 'SJ', name: 'San Jose' }
  ],
  NY: [
    { code: 'NYC', name: 'New York City' },
    { code: 'BUF', name: 'Buffalo' },
    { code: 'ALB', name: 'Albany' },
    { code: 'ROC', name: 'Rochester' }
  ],
  MH: [
    { code: 'MUM', name: 'Mumbai' },
    { code: 'PUN', name: 'Pune' },
    { code: 'NGP', name: 'Nagpur' },
    { code: 'NAS', name: 'Nashik' }
  ],
  ENG: [
    { code: 'LON', name: 'London' },
    { code: 'MAN', name: 'Manchester' },
    { code: 'BIR', name: 'Birmingham' },
    { code: 'LIV', name: 'Liverpool' }
  ]
}

export const collegeTypes = [
  'Engineering',
  'Medical',
  'Business',
  'Arts & Science',
  'Law',
  'Architecture',
  'Pharmacy',
  'Agriculture'
]

export const leadStatuses = [
  'new',
  'contacted',
  'qualified',
  'proposal',
  'negotiation',
  'won',
  'lost'
]

export const departments = [
  'Sales',
  'Marketing',
  'HR',
  'Information Technology',
  'Finance',
  'Operations'
]

export const priorities = [
  'low',
  'medium',
  'high',
  'urgent'
]
