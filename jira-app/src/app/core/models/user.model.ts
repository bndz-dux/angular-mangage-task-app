export interface User {
  id: string;
  name: string;
  email: string;
  avatarUrl?: string;
  initials: string;
  color: string;
  role: string;
}

export const SEED_USERS: User[] = [
  {
    id: 'user-1',
    name: 'Lord Gaben',
    email: 'gaben@valvesoftware.com',
    initials: 'LG',
    color: '#2563EB', // Blue
    role: 'Product Lead',
  },
  {
    id: 'user-2',
    name: 'Baby Yoda',
    email: 'grogu@mandalore.galaxy',
    initials: 'BY',
    color: '#22A06B', // Green
    role: 'Frontend Wizard',
  },
  {
    id: 'user-3',
    name: 'Walter White',
    email: 'heisenberg@cook.org',
    initials: 'WW',
    color: '#8B5CF6', // Purple
    role: 'Backend Architect',
  },
  {
    id: 'user-4',
    name: 'Pickle Rick',
    email: 'solenya@citadel.dimension',
    initials: 'PR',
    color: '#D97706', // Amber / Orange
    role: 'QA Specialist',
  },
  {
    id: 'user-5',
    name: 'SpongeBob',
    email: 'spongebob@krustykrab.sea',
    initials: 'SB',
    color: '#EC4899', // Pink
    role: 'DevOps Engineer',
  },
];
