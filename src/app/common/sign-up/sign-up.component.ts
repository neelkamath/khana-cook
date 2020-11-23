import {Component} from '@angular/core';
import {createAccount, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../messages';

@Component({selector: 'app-sign-up', templateUrl: './sign-up.component.html'})
export class SignUpComponent {
    emailAddress: string = '';
    password: string = '';

    constructor(private message: NzMessageService) {
    }

    async submit(): Promise<void> {
        try {
            await createAccount(this.emailAddress, this.password, 'cook');
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
