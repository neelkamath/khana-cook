import {Menu, Role, UpdatedMenuItem} from './models';

export const SERVER_ERROR = 'SERVER_ERROR';
export const ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR';

/**
 * @throws {string, SERVER_ERROR} <'EXISTENT_EMAIL_ADDRESS'>, or <'INVALID_PASSWORD'>.
 */
export async function createAccount(emailAddress: string, password: string, role: Role): Promise<void> {
    const response = await fetch(
        'http://localhost/create-account',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({emailAddress, password, role}),
        }
    );
    switch (response.status) {
        case 204:
            return;
        case 400:
            const data = await response.json();
            throw data.reason;
        default:
            throw SERVER_ERROR;
    }
}

/**
 * @return a JWT which expires in one hour.
 * @throws {string, SERVER_ERROR} <'UNREGISTERED_EMAIL_ADDRESS'>, or <'INCORRECT_PASSWORD'>.
 */
export async function requestAccessToken(emailAddress: string, password: string): Promise<string> {
    const response = await fetch(
        'http://localhost/request-access-token',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({emailAddress, password}),
        }
    );
    const data = await response.json();
    switch (response.status) {
        case 200:
            return data.accessToken;
        case 400:
            throw data.reason;
        default:
            throw SERVER_ERROR;
    }
}

/**
 * @param item If the item already exists, it'll be replaced. Otherwise, it'll be created.
 * @param accessToken The user must be a cook to perform this action.
 * @throws {ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
export async function updateMenu(item: UpdatedMenuItem, accessToken: string): Promise<void> {
    const response = await fetch(
        'http://localhost/update-menu',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
            body: JSON.stringify({...item}),
        }
    );
    switch (response.status) {
        case 204:
            return;
        case 401:
            throw ACCESS_TOKEN_ERROR;
        default:
            throw SERVER_ERROR;
    }
}

/**
 * @throws {SERVER_ERROR}
 */
export async function readMenu(): Promise<Menu> {
    const response = await fetch('http://localhost/read-menu');
    switch (response.status) {
        case 200:
            return await response.json();
        default:
            throw SERVER_ERROR;
    }
}
