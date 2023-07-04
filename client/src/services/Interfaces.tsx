export interface role {
  role: "user" | "admin";
}

export interface Bcard {
  status?: any;
  _id?: string | null;
  title?: string | null;
  subTitle?: string | null;
  description?: string | null;
  phone?: string | null;
  email?: string | null;
  web?: string | null;
  image?: string | null;
  country?: string | null;
  city?: string | null;
  houseNumber?: string | null;
  zip?: string | null;
  street?: string | null;
  favorites?: [] | null;
  favoriteCards?: any;
  longitude?: number;
  latitude?: number;
  createdAt?: Date | null;
  message?: any;
}

export interface User {
  _id?: string | null;
  name?: string | null;
  lastName?: string | null;
  password?: string | null;
  phone?: string | null;
  email?: string | null;
  confirmPassword?: string | null;
  image?: string | null;
  imageAlt?: string | null;
  country?: string | null;
  city?: string | null;
  houseNumber?: string | null;
  zip?: string | null;
  bizChecked?: boolean | null; // from sign form
  token?: string | undefined;
  biz?: boolean; // from token
  role?: any;
  street?: string | null;
  favorites?: [string] | null;
  status?: any;
  message?: string;
  active?: boolean;
  data?: any;
}
