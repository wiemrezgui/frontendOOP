import { Domain } from "./domain.model";

export enum TrainingType {
    ONLINE = 'ONLINE',
    ONSITE = 'ONSITE',
    HYBRID = 'HYBRID'
  }
  
  export class Training {
    trainingId!: string;
    title!: string;
    startDate!: string;
    endDate!: string;
    description?: string;
    domainId?: string;
    price!: number;
    startTime!: string; 
    endTime!: string;
    type!: string;
    trainerId !: number;
    trainer?: { 
      trainerId?: number;
      trainerType?: string;
      employerName?: string;
      user?: { 
          userId?: number;
          username?: string;
          email?: string;
          phoneNumber?: string;
          profilePicture?: string;
      };
  };
    domain?:Domain
    constructor(init?: Partial<Training>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }