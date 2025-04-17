export class Participant {
  participantId!: number;
  structure: string='';
  profile: string='';
  phoneNumber?: string; // From User
  username: string = '';
  email: string = '';
  role: 'PARTICIPANT' | 'TRAINER' | 'ADMIN' | null = null;
  dateOfBirth: string | null = null; // ISO format (yyyy-MM-dd)
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null = null;
  profilePicture: string | null = null;
  description: string | null = null;
  
  constructor(data?: Partial<Participant>) {
    if (data) {
      Object.assign(this, data);
    }
  }

}