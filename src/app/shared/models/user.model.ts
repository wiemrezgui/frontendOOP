export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export interface UserRegisterRequest {
  username: string;
  email: string;
  password: string;
  role: Role;
  phoneNumber?: string;
  dateOfBirth?: Date | string;
  gender?: Gender;
  profilePicture?: string;
  description?: string;
}

export interface UserResponse {
  userId: number;
  username: string;
  email: string;
  role: Role;
  phoneNumber?: string;
  dateOfBirth?: Date;
  gender?: Gender;
  profilePicture?: string;
  description?: string;
}