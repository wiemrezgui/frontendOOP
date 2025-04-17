export class Trainer {
  // Trainer fields
  trainerId: number | null = null;
  trainerType: 'INTERNAL' | 'EXTERNAL' | null = null;
  employerName: string = '';

  // User fields
  userId: number | null = null;
  username: string = '';
  email: string = '';
  role: 'PARTICIPANT' | 'TRAINER' | 'ADMIN' | null = null;
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

  // Helper method to create from API response
  static fromApiResponse(apiData: any): Trainer {
    return new Trainer({
      trainerId: apiData.trainerId,
      trainerType: apiData.trainerType,
      employerName: apiData.employerName,
      userId: apiData.user?.userId,
      username: apiData.user?.username,
      email: apiData.user?.email,
      role: apiData.user?.role,
      phoneNumber: apiData.user?.phoneNumber,
      dateOfBirth: apiData.user?.dateOfBirth,
      gender: apiData.user?.gender,
      profilePicture: apiData.user?.profilePicture,
      description: apiData.user?.description
    });
  }

  // Method to prepare data for API (if needed)
  toApiRequest(): any {
    return {
      trainerId: this.trainerId,
      trainerType: this.trainerType,
      employerName: this.employerName,
      user: {
        userId: this.userId,
        username: this.username,
        email: this.email,
        role: this.role,
        phoneNumber: this.phoneNumber,
        dateOfBirth: this.dateOfBirth,
        gender: this.gender,
        profilePicture: this.profilePicture,
        description: this.description
      }
    };
  }
}