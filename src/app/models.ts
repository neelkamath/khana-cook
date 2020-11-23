export type Role = 'student' | 'cook';

export type FoodPoint = 'APU' | 'Engineering Block' | 'Breakfast and Snacks Food Bus' | 'Lunch Food Bus';

export interface UpdatedMenuItem {
    foodPoint: FoodPoint;
    name: string;
    picUrl?: string;
    quantity: number;
    price: number;
}

export interface Menu {
    readonly items: MenuItem[];
}

export interface MenuItem {
    readonly foodPoint: FoodPoint;
    readonly name: string;
    readonly picUrl?: string;
    readonly quantity: number;
    readonly price: number;
    readonly id: string;
}

export interface IncompleteOrders {
    readonly orders: IncompleteOrder[];
}

export interface IncompleteOrder {
    readonly token: string;
    readonly status: IncompleteOrderStatus;
    readonly price: number;
    readonly items: IncompleteOrderItem[];
}

export type IncompleteOrderStatus = 'PREPARING' | 'PREPARED';

export interface IncompleteOrderItem {
    readonly quantity: number;
    readonly name: string;
}
