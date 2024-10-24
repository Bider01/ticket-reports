import { Pipe, PipeTransform } from '@angular/core';
import { AppConfigService } from '@app/app-config.service';

@Pipe({name: 'variationPipe'})
export class VariationPipe implements PipeTransform {
  constructor(private configService: AppConfigService) {}

  transform(value: string): string {
    return this.configService.getVariation(value);
  }
}
