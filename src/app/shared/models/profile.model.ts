export class Profile {
    profileId?: number;
    profileType?: string;
    constructor(data?: Partial<Profile>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }