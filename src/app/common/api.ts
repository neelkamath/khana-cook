import {FoodPoint, IncompleteOrders, Menu, NewOrder, PlacedOrders, Role, UpdatedMenuItem} from './models';

export const SERVER_ERROR = 'SERVER_ERROR';
export const ACCESS_TOKEN_ERROR = 'ACCESS_TOKEN_ERROR';
export const INVALID_FOOD_POINT_ERROR = 'INVALID_FOOD_POINT_ERROR';
export const INVALID_ORDER_UPDATE_ERROR = `The specified order ID didn't exist, it's status wasn't "PREPARING" (if the `
    + `order's status was for it to be picked up), or it's status wasn't "PREPARED" (if the order's status was for it `
    + `to have just been picked up).`;
export const INVALID_ORDER_ERROR = 'INVALID_ORDER_ERROR';

/**
 * @throws {string, SERVER_ERROR} <'EXISTENT_EMAIL_ADDRESS'>, or <'INVALID_PASSWORD'>.
 */
export async function postCreateAccount(emailAddress: string, password: string, role: Role): Promise<void> {
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
export async function postRequestAccessToken(emailAddress: string, password: string): Promise<string> {
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
export async function postUpdateMenu(item: UpdatedMenuItem, accessToken: string): Promise<void> {
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
export async function getReadMenu(): Promise<Menu> {
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
export async function getReadIncompleteOrders(foodPoint: FoodPoint, accessToken: string): Promise<IncompleteOrders> {
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
export async function postPrepareOrder(orderId: string, accessToken: string): Promise<void> {
    await updateOrder('prepare', orderId, accessToken);
}

/**
 * @param orderId the order which was picked up.
 * @param accessToken The user must be a cook.
 * @throws {INVALID_ORDER_UPDATE_ERROR, ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
export async function postPickUpOrder(orderId: string, accessToken: string): Promise<void> {
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

/**
 * @param accessToken The token of the student whose orders are to be retrieved.
 * @throws {ACCESS_TOKEN_ERROR, SERVER_ERROR}
 */
export async function getOrders(accessToken: string): Promise<PlacedOrders> {
    const response = await fetch(
        `http://localhost/orders`,
        {
            headers: {'Authorization': `Bearer ${accessToken}`},
        },
    );
    switch (response.status) {
        case 200:
            return await response.json();
        case 401:
            throw ACCESS_TOKEN_ERROR;
        default:
            throw SERVER_ERROR;
    }
}

/**
 * @param accessToken A student's token.
 * @param order
 * @return the order ID.
 * @throws {INVALID_ORDER_ERROR, ACCESS_TOKEN_ERROR, SERVER_ERROR} An <INVALID_ORDER_ERROR> gets thrown when ordering
 * an item in a quantity unavailable (e.g., ordering three lemonades when only two are in stock).
 */
export async function postOrder(accessToken: string, order: NewOrder): Promise<string> {
    const response = await fetch(
        'http://localhost/order',
        {
            method: 'POST',
            headers: {'Content-Type': 'application/json', 'Authorization': `Bearer ${accessToken}`},
            body: JSON.stringify({...order}),
        },
    );
    switch (response.status) {
        case 200:
        case 400:
            const body = await response.json();
            if (response.status === 400 && body.reason === 'INVALID_ITEM') throw INVALID_ORDER_ERROR;
            if (response.status === 200) return body.token;
            throw SERVER_ERROR;
        case 401:
            throw ACCESS_TOKEN_ERROR;
        default:
            throw SERVER_ERROR;
    }
}
