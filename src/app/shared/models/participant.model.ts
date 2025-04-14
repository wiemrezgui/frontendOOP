export class Participant {
  participantId!: number;
  fullName!: string;    // Combined name field
  email!: string;       // From User
  phoneNumber?: string; // From User
  structure!: string;
  profile!: string;
  
  constructor(init?: Partial<Participant>) {
    Object.assign(this, init);
  }
}