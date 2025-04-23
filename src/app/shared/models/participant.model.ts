export class Participant {
  participantId: number | null = null;
  structure: string = '';
  profile: string = '';
  
  // User fields
  username: string = '';
  email: string = '';
  phoneNumber: string | null = null;
  dateOfBirth: string | null = null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null = null;
  profilePicture: string | null = null;
  description: string | null = null;

  constructor(data?: Partial<Participant>) {
    if (data) {
      Object.assign(this, data);
    }
  }
}