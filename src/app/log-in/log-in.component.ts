import {Component} from '@angular/core';
import {requestAccessToken, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {saveAccessToken} from '../access-token';
import {SERVER_ERROR_MESSAGE} from '../messages';

@Component({selector: 'app-log-in', templateUrl: './log-in.component.html'})
export class LogInComponent {
    emailAddress: string = '';
    password: string = '';

    constructor(private message: NzMessageService) {
    }

    async submit(): Promise<void> {
        try {
            const token = await requestAccessToken(this.emailAddress, this.password);
            saveAccessToken(token);
        } catch (e) {
            switch (e) {
                case 'UNREGISTERED_EMAIL_ADDRESS':
                    this.message.error('No such registered email address.');
                    return;
                case 'INCORRECT_PASSWORD':
                    this.message.error('Incorrect password.');
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
            }
        }
        location.href = '/dashboard';
    }
}
