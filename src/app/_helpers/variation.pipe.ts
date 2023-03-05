import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '12586':
        return 'SE polgár';
      case '12587':
        return 'SE polgár - MFF';
      case '12588':
        return 'Kísérő';
      case '12589':
        return 'Kísérő - MFF';
    }
    return 'N/A';
  }
}
