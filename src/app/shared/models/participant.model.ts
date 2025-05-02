import { Profile } from "./profile.model";
import { Structure } from "./structure.model";

export class Participant {
  participantId: number = 0;
  structureId: string = '';
  profileId: string = '';
  username: string = '';
  email: string = '';
  phoneNumber: string | null = null;
  dateOfBirth: string | null = null;
  gender: 'MALE' | 'FEMALE' | 'OTHER' | null = null;
  profilePicture: string | null = '';
  description: string | null = null;
  user?: { 
    username: string;
    email: string;
  };
  profile? : Profile;
  structure?:Structure;
  constructor(data?: Partial<Participant>) {
    if (data) {
      // Ensure participantId is always set
      this.participantId = data.participantId ?? 0;
      // Map all other properties
      Object.assign(this, data);
    }
  }
}