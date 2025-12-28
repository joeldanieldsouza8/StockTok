// User related types
export interface User {
  id: string;
  email: string;
  name: string;
  picture?: string;
  // Add more user properties as needed
}

export interface UserProfile extends User {
  bio?: string;
  location?: string;
  createdAt: string;
  updatedAt: string;
}
