import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { AuthenticationService } from './_services';
import { User } from './_models';
import {AppConfigService} from "@app/app-config.service";

@Component({ selector: 'app', templateUrl: 'app.component.html', styleUrls: ['app.component.css'] })
export class AppComponent {
    user: User;
    version: string;

    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private configService: AppConfigService
    ) {
        this.authenticationService.user.subscribe(x => this.user = x);
        this.version = this.configService.getConfig().version;
    }

    logout() {
        this.authenticationService.logout();
    }
}
