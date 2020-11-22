export type Role = 'student' | 'cook';

export const SERVER_ERROR = 'The server is currently unavailable. Please try again later.';

/**
 * @throws {string} <'EXISTENT_EMAIL_ADDRESS'>, <'INVALID_PASSWORD'>, or <SERVER_ERROR>.
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
 * @throws {string} <'UNREGISTERED_EMAIL_ADDRESS'>, <'INCORRECT_PASSWORD'>, or <SERVER_ERROR>.
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
