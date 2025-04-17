export enum Role {
  ADMIN = 'ADMIN',
  MANAGER = 'MANAGER'
}

export enum Gender {
  MALE = 'MALE',
  FEMALE = 'FEMALE'
}

export class User{
  username: string='';
  email: string='';
  password: string='';
  role?: Role;
  phoneNumber: string='';
  dateOfBirth: string='';
  gender?: Gender;
  profilePicture?: string;
  description: string='';
}
