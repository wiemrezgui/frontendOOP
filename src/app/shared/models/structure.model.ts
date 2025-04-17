export class Structure {
    structureId?: number;
    structureName?: string;
    constructor(data?: Partial<Structure>) {
      if (data) {
        Object.assign(this, data);
      }
    }
  }