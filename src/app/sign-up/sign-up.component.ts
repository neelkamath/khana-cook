import {Component, OnInit} from '@angular/core';
import {createAccount, SERVER_ERROR} from '../api';
import {NzMessageService} from 'ng-zorro-antd/message';
import {SERVER_ERROR_MESSAGE} from '../messages';

@Component({
    selector: 'app-sign-up',
    templateUrl: './sign-up.component.html',
})
export class SignUpComponent implements OnInit {
    emailAddress: string = '';
    password: string = '';

    constructor(private message: NzMessageService) {
    }

    ngOnInit(): void {
    }

    async submit(): Promise<void> {
        try {
            await createAccount(this.emailAddress, this.password, 'cook');
        } catch (e) {
            switch (e) {
                case 'EXISTENT_EMAIL_ADDRESS':
                    this.message.error('Email address already registered.');
                    break;
                case 'INVALID_PASSWORD':
                    this.message.error('The password must have at least one non-whitespace character.');
                    break;
                case SERVER_ERROR:
                    this.message.error(SERVER_ERROR_MESSAGE);
            }
            return;
        }
        this.message.success('Account created!');
    }
}
