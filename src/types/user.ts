export interface User {
  username: string;
  email: string;
  password: string;
  role: string; // role could be "0" (admin), "1" (manager), or "2" (user)
}
