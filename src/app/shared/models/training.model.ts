export enum TrainingType {
    ONLINE = 'ONLINE',
    ONSITE = 'ONSITE',
    HYBRID = 'HYBRID'
  }
  
  export class Training {
    trainingId!: string;  // UUID from backend
    title!: string;
    startDate!: string;
    endDate!: string;
    description?: string;
    domainName?: string;
    price!: number;
    startTime!: string;   // LocalTime as string (e.g., "09:00")
    endTime!: string;     // LocalTime as string (e.g., "17:00")
    type!: TrainingType;
    
    constructor(init?: Partial<Training>) {
      if (init) {
        Object.assign(this, init);
      }
    }
  }