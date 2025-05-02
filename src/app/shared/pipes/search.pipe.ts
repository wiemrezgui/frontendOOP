import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'search'
})
export class SearchPipe implements PipeTransform {

  transform(items: any[], searchText: string, properties?: string[]): any[] {
    if (!items) return [];
    if (!searchText) return items;

    searchText = searchText.toLowerCase();

    return items.filter(item => {
      // If specific properties are provided, search only those
      if (properties && properties.length > 0) {
        return properties.some(prop => {
          const value = this.getProperty(item, prop);
          return value?.toString().toLowerCase().includes(searchText);
        });
      }
      
      // Otherwise search all string properties
      return Object.keys(item).some(key => {
        const value = item[key];
        return typeof value === 'string' && 
               value.toLowerCase().includes(searchText);
      });
    });
  }

  private getProperty(obj: any, path: string): any {
    return path.split('.').reduce((o, p) => o?.[p], obj);
  }

}
