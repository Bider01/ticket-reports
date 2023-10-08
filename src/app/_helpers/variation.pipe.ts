import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '15653':
        return 'Gólya';
      case '15654':
        return 'SE polgár';
      case '15655':
        return 'Kísérő';
      // case '12589':
      //   return 'Kísérő - MFF';
    }
    return 'N/A';
  }
}
