export interface IAuthUser {
  id: string;
  name: string;
  email: string;
  role: "ADMIN" | "MEMBER";
}

export interface IRegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface ILoginPayload {
  email: string;
  password: string;
}
