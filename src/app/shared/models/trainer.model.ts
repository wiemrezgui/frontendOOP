export class Trainer {
    id!: number;
    username!: string;
    firstName!: string;
    lastName!: string;
    email!: string;
    phoneNumber!: string;
    specialization!: string;
    type: 'INTERNAL' | 'EXTERNAL' = "INTERNAL";
    profileImage?: string;
    gender!: string;
    dateOfBirth!: string;
    address!: string;
    description!: string;
    github!: string;
    facebook!: string;
    linkedin!: string;
  }