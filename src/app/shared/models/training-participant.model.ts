export enum TrainingType {
    ONLINE = 'ONLINE',
    IN_PERSON = 'IN_PERSON',
    HYBRID = 'HYBRID'
  }
export class TrainingParticipant {
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
    trainingId!: string;  // UUID from backend
    title!: string;
    startDate!: Date;
    endDate!: Date;
    domainName?: string;
    price!: number;
    startTime!: string;   // LocalTime as string (e.g., "09:00")
    endTime!: string;     // LocalTime as string (e.g., "17:00")
    type!: TrainingType;
   
  
  }