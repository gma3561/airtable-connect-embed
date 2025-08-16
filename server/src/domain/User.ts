export type UserRole = 'admin' | 'marketing' | 'backoffice' | 'agent';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  isActive?: boolean;
  createdAt?: string;
  updatedAt?: string;
}
