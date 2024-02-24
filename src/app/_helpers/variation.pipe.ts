import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '17738':
        return 'SE polgár';
      case '17739':
        return 'SE polgár - MFF';
      case '17740':
        return 'Kísérő';
      case '17741':
        return 'Kísérő - MFF';
    }
    return 'N/A';
  }
}
