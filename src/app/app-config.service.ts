import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AppConfigService {
  private config: any;

  constructor(private http: HttpClient) {}

  loadConfig(): Promise<void> {
    return this.http.get('assets/config.json')
      .toPromise()
      .then((data) => {
        this.config = data;
      });
  }

  getConfig(): any {
    return this.config;
  }

  getVariation(key: string): string {
    if (this.config && this.config.variations) {
      return this.config.variations[key] || 'N/A - '+ key;
    }
    return 'N/A - '+ key;
  }
}
