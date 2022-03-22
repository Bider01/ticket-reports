import { Pipe, PipeTransform } from '@angular/core';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  transform(value: string): string {
    switch (value) {
      case '6995':
        return 'SE/alap';
      case '6996':
        return 'SE/MFF';
      case '6997':
        return 'Külsős/alap';
      case '6998':
        return 'Külsős/MFF';
    }
    return 'N/A';
  }
}
