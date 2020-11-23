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
