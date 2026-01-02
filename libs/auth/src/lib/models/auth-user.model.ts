export interface AuthUser {
  id: string | number;
  email: string;
  name?: string;
  roles?: string[];
  emailVerified?: boolean;
  [key: string]: any;
}

