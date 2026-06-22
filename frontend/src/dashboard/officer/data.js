export const officerProfile = {
  name: 'Rajesh Kumar',
  designation: 'Field Officer',
  department: 'Public Works Department (PWD)',
  avatar: 'https://i.pravatar.cc/150?u=rajesh'
};

export const summaryStats = {
  assigned: 12,
  dueToday: 5,
  overdue: 2,
  performanceScore: 82,
  verification: {
    verified: 8,
    pending: 3,
    rejected: 1
  }
};

export const incidents = [
  {
    id: 'INC-2026-0042',
    title: 'Water Supply Issue',
    location: 'Rohini, Sector 7',
    assignedDate: '20 May 2026',
    dueDate: '22 May 2026, 11:59 PM',
    priority: 'High',
    status: 'In Progress',
    department: 'Delhi Jal Board'
  },
  {
    id: 'INC-2026-0038',
    title: 'Garbage Collection Pending',
    location: 'Dwarka, Sector 12',
    assignedDate: '20 May 2026',
    dueDate: '23 May 2026, 11:59 PM',
    priority: 'Medium',
    status: 'Assigned',
    department: 'MCD'
  },
  {
    id: 'INC-2026-0029',
    title: 'Pothole on Main Road',
    location: 'Najafgarh, Block A',
    assignedDate: '19 May 2026',
    dueDate: '24 May 2026, 11:59 PM',
    priority: 'Medium',
    status: 'In Progress',
    department: 'PWD'
  },
  {
    id: 'INC-2026-0016',
    title: 'Severe Water Logging',
    location: 'Karol Bagh, Block 4',
    assignedDate: '18 May 2026',
    dueDate: '21 May 2026, 11:59 PM',
    priority: 'High',
    status: 'Overdue',
    department: 'MCD'
  }
];

export const todayTasks = [
  { time: '10:00 AM', title: 'Site visit – Water Supply Issue', location: 'Rohini, Sector 7', status: 'Completed' },
  { time: '12:30 PM', title: 'Inspect – Garbage Collection', location: 'Dwarka, Sector 12', status: 'In Progress' },
  { time: '03:00 PM', title: 'Check – Road Damage', location: 'Najafgarh, Block A', status: 'Pending' },
  { time: '05:00 PM', title: 'Review – Water Logging', location: 'Karol Bagh, Block 4', status: 'Pending' }
];

export const priorityAlerts = [
  { id: 1, type: 'high_priority', message: '2 incidents have breached the SLA. Take immediate action.', date: 'Today, 09:00 AM' },
  { id: 2, type: 'rejection', message: 'Citizen rejected closure for INC-2026-0011.', date: 'Yesterday, 06:45 PM' }
];
