export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  bio?: string | null;
  organization?: string | null;
  jobTitle?: string | null;
  location?: string | null;
  website?: string | null;
  phone?: string | null;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE";
  canChangePassword?: boolean;
  connectedProviders?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  image?: string;
  bio?: string;
  organization?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  phone?: string;
  avatar?: File;
}

export interface IUpdateUserByAdminPayload {
  role?: "ADMIN" | "MEMBER";
  status?: "ACTIVE" | "INACTIVE";
}
