export interface IUpdateUserProfile {
  name?: string;
  image?: string;
  bio?: string;
  organization?: string;
  jobTitle?: string;
  location?: string;
  website?: string;
  phone?: string;
}

export interface IUpdateUserByAdmin {
  role?: string;
  status?: string;
}
