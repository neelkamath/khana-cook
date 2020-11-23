import {Component, OnInit} from '@angular/core';
import {requestAccessToken, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {saveAccessToken} from '../access-token';
import {SERVER_ERROR_MESSAGE} from '../messages';

@Component({
    selector: 'app-log-in',
    templateUrl: './log-in.component.html'
})
export class LogInComponent implements OnInit {
    emailAddress: string = '';
    password: string = '';

    constructor(private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    async submit(): Promise<void> {
        try {
            const token = await requestAccessToken(this.emailAddress, this.password);
            saveAccessToken(token);
        } catch (e) {
            switch (e) {
                case 'UNREGISTERED_EMAIL_ADDRESS':
                    this.message.error('No such registered email address.');
                    break;
                case 'INCORRECT_PASSWORD':
                    this.message.error('Incorrect password.');
                    break;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
            }
            return;
        }
        location.href = '/dashboard';
    }
}
