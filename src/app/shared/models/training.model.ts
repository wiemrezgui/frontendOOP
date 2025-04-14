export enum TrainingType {
    ONLINE = 'ONLINE',
    IN_PERSON = 'IN_PERSON',
    HYBRID = 'HYBRID'
  }
  
  export class Training {
    trainingId!: string;  // UUID from backend
    title!: string;
    startDate!: Date;
    endDate!: Date;
    description?: string;
    domainName?: string;
    price!: number;
    startTime!: string;   // LocalTime as string (e.g., "09:00")
    endTime!: string;     // LocalTime as string (e.g., "17:00")
    type!: TrainingType;
    
    constructor(init?: Partial<Training>) {
      if (init) {
        Object.assign(this, init);
        
        // Convert string dates to Date objects
        if (init.startDate && typeof init.startDate === 'string') {
          this.startDate = new Date(init.startDate);
        }
        if (init.endDate && typeof init.endDate === 'string') {
          this.endDate = new Date(init.endDate);
        }
      }
    }
  }