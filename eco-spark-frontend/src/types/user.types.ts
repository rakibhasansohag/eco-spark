export interface IUser {
  id: string;
  name: string;
  email: string;
  image: string | null;
  role: "ADMIN" | "MEMBER";
  status: "ACTIVE" | "INACTIVE";
  createdAt: string;
  updatedAt: string;
}

export interface IUpdateProfilePayload {
  name?: string;
  image?: string;
}

export interface IUpdateUserByAdminPayload {
  role?: "ADMIN" | "MEMBER";
  status?: "ACTIVE" | "INACTIVE";
}
