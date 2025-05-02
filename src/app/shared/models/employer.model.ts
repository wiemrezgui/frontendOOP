export class Employer {
    id?: number;
    employerName?: string;
    
    constructor(data?: Partial<Employer>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }