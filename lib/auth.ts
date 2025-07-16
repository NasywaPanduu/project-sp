import { User, demoAccounts } from './data';

export const login = (email: string, password: string): User | null => {
  // Check demo accounts first
  const demoUser = demoAccounts.find(account => account.email === email);
  if (demoUser && password === 'demo123') {
    localStorage.setItem('currentUser', JSON.stringify(demoUser));
    return demoUser;
  }
  
  // Check registered users
  const registeredUsers = getRegisteredUsers();
  const user = registeredUsers.find(account => account.email === email);
  if (user && user.password === password) {
    localStorage.setItem('currentUser', JSON.stringify(user));
    return user;
  }
  return null;
};

export const register = (userData: Omit<User, 'id'> & { password: string }): User => {
  // Check if email already exists
  const existingUsers = getRegisteredUsers();
  const demoEmails = demoAccounts.map(acc => acc.email);
  
  if (existingUsers.some(user => user.email === userData.email) || 
      demoEmails.includes(userData.email)) {
    throw new Error('Email already exists');
  }
  
  const newUser: User = {
    id: `user-${Date.now()}`,
    name: userData.name,
    email: userData.email,
    role: userData.role,
    avatar: userData.role === 'driver' 
      ? 'https://images.pexels.com/photos/415829/pexels-photo-415829.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop'
      : 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=100&h=100&fit=crop',
    licensePlate: userData.role === 'driver' ? '' : undefined,
    vehicleType: userData.role === 'driver' ? '' : undefined,
  };
  
  // Save to registered users with password
  const userWithPassword = { ...newUser, password: userData.password };
  existingUsers.push(userWithPassword);
  localStorage.setItem('registeredUsers', JSON.stringify(existingUsers));
  
  // Set as current user (without password)
  localStorage.setItem('currentUser', JSON.stringify(newUser));
  return newUser;
};

export const getRegisteredUsers = (): (User & { password: string })[] => {
  if (typeof window === 'undefined') return [];
  const users = localStorage.getItem('registeredUsers');
  return users ? JSON.parse(users) : [];
};

export const logout = (): void => {
  localStorage.removeItem('currentUser');
};

export const getCurrentUser = (): User | null => {
  if (typeof window === 'undefined') return null;
  const userStr = localStorage.getItem('currentUser');
  return userStr ? JSON.parse(userStr) : null;
};

export const updateUser = (userData: Partial<User>): void => {
  const currentUser = getCurrentUser();
  if (currentUser) {
    const updatedUser = { ...currentUser, ...userData };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));
  }
};