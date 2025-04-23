export class Trainer {
  // Trainer fields
  trainerId: number | null = null;
  trainerType: 'INTERNAL' | 'EXTERNAL' | null = null;
  employerName: string = '';

  // User fields
  userId: number | null = null;
  username: string = '';
  email: string = '';
  phoneNumber: string | null = null;
  dateOfBirth: string | null = null; // ISO format (yyyy-MM-dd)
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null = null;
  profilePicture: string | null = null;
  description: string | null = null;

  constructor(data?: Partial<Trainer>) {
    if (data) {
      Object.assign(this, data);
    }
  }


}