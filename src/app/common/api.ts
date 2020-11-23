import {FoodPoint, IncompleteOrders, Menu, Role, UpdatedMenuItem} from './models';

export const SERVER_ERROR = 'SERVER_ERROR';
export const ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR';
export const INVALID_FOOD_POINT_ERROR = 'INVALID_FOOD_POINT_ERROR';
export const INVALID_ORDER_UPDATE_ERROR = `The specified order ID didn't exist, it's status wasn't "PREPARING" (if the `
    + `order's status was for it to be picked up), or it's status wasn't "PREPARED" (if the order's status was for it `
    + `to have just been picked up).`;

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

/**
 * @param foodPoint Incomplete orders from this food point will be returned.
 * @param accessToken The user must be a cook.
 * @throws {ACCESS_TOKEN_ERROR, SERVER_ERROR, INVALID_FOOD_POINT_ERROR} An <INVALID_FOOD_POINT_ERROR> will be thrown if
 * the <foodPoint> isn't a <FoodPoint>.
 */
export async function readIncompleteOrders(foodPoint: FoodPoint, accessToken: string): Promise<IncompleteOrders> {
    const params = new URLSearchParams({'food-point': foodPoint});
    const response = await fetch(
        `http://localhost/incomplete-orders?${params}`,
        {
            headers: {'Authorization': `Bearer ${accessToken}`},
        }
    );
    switch (response.status) {
        case 200:
            return await response.json();
        case 400:
            throw INVALID_FOOD_POINT_ERROR;
        case 401:
            throw ACCESS_TOKEN_ERROR;
        default:
            throw SERVER_ERROR;
    }
}

/**
 * @param orderId the order which is ready to be picked up.
 * @param accessToken The user must be a cook.
 * @throws {INVALID_ORDER_UPDATE_ERROR, ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
export async function prepareOrder(orderId: string, accessToken: string): Promise<void> {
    await updateOrder('prepare', orderId, accessToken);
}

/**
 * @param orderId the order which was picked up.
 * @param accessToken The user must be a cook.
 * @throws {INVALID_ORDER_UPDATE_ERROR, ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
export async function pickUpOrder(orderId: string, accessToken: string): Promise<void> {
    await updateOrder('pick-up', orderId, accessToken);
}

type OrderUpdate = 'prepare' | 'pick-up';

/**
 * @param type the type of update to perform.
 * @param orderId the order whose status should be updated.
 * @param accessToken The user must be a cook.
 * @throws {INVALID_ORDER_UPDATE_ERROR, ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
async function updateOrder(type: OrderUpdate, orderId: string, accessToken: string): Promise<void> {
    const params = new URLSearchParams({'order-id': orderId});
    const response = await fetch(
        `http://localhost/${type}-order?${params}`,
        {
            method: 'POST',
            headers: {'Authorization': `Bearer ${accessToken}`},
        },
    );
    switch (response.status) {
        case 204:
            return;
        case 400:
            throw INVALID_ORDER_UPDATE_ERROR;
        case 401:
            throw ACCESS_TOKEN_ERROR;
        default:
            throw SERVER_ERROR;
    }
}