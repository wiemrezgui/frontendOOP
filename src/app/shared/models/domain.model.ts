export class Domain {
    domainId?: number;
    domainName?: string;
    
    constructor(data?: Partial<Domain>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }