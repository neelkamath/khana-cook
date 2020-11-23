import {ACCESS_TOKEN_ERROR_MESSAGE} from './messages';
import {NzMessageService} from 'ng-zorro-antd/message';

/**
 * Redirects to the "/account" page.
 *
 * @param message used to tell the user they'll have to log in again.
 */
export function handleInvalidAccessToken(message: NzMessageService): void {
    message.info(ACCESS_TOKEN_ERROR_MESSAGE);
    setTimeout(() => location.href = '/account', 1000);
}

/**
 * @param token overwrites the existing token if one exists.
 */
export function saveAccessToken(token: string): void {
    localStorage.setItem('accessToken', token);
}

/**
 * @returns either the currently saved access token (which may be expired), or <null> if there's no token saved.
 */
export function getAccessToken(): string | null {
    return localStorage.getItem('accessToken');
}
