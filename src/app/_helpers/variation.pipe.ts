import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '11035':
        return 'Gólya/instruktor';
      case '11025':
        return 'SE polgár';
      case '11026':
        return 'Kísérő';
    }
    return 'N/A';
  }
}
