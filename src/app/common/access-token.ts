import {ACCESS_TOKEN_ERROR_MESSAGE} from './messages';
import {NzMessageService} from 'ng-zorro-antd/message';
import {Role} from './models';
import jwtDecode from 'jwt-decode';

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

/**
 * @return the role of the access token (assumed to have been saved).
 */
export function getAccessTokenRole(): Role {
    return jwtDecode<Jwt>(getAccessToken()!).role;
}

/**
 * @return the user ID of the access token (assumed to have been saved).
 */
export function getAccessTokenUserId(): string {
    return jwtDecode<Jwt>(getAccessToken()!).userId;
}

interface Jwt {
    readonly userId: string;
    readonly role: Role;
    readonly iat: number;
    readonly exp: number;
}
