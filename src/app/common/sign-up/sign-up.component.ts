import {Component} from '@angular/core';
import {postCreateAccount, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../messages';
import {Role} from '../models';

@Component({selector: 'app-sign-up', templateUrl: './sign-up.component.html'})
export class SignUpComponent {
    emailAddress: string = '';
    password: string = '';
    type: Role = 'student';

    constructor(private message: NzMessageService) {
    }

    async submit(): Promise<void> {
        try {
            await postCreateAccount(this.emailAddress, this.password, this.type);
        } catch (e) {
            switch (e) {
                case 'EXISTENT_EMAIL_ADDRESS':
                    this.message.error('Email address already registered.');
                    return;
                case 'INVALID_PASSWORD':
                    this.message.error('The password must have at least one non-whitespace character.');
                    return;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
                    return;
            }
        }
        this.message.success('Account created!');
    }
}
