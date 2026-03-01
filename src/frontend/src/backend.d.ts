import type { Principal } from "@icp-sdk/core/principal";
export interface Some<T> {
    __kind__: "Some";
    value: T;
}
export interface None {
    __kind__: "None";
}
export type Option<T> = Some<T> | None;
export interface ContactInquiry {
    id: bigint;
    name: string;
    email: string;
    message: string;
    timestamp: bigint;
}
export interface Order {
    id: bigint;
    customerName: string;
    status: string;
    customerPhone: string;
    productId: bigint;
    productName: string;
    customerAddress: string;
    timestamp: bigint;
    productPrice: string;
}
export interface UserProfile {
    name: string;
}
export interface Product {
    id: bigint;
    inStock: boolean;
    name: string;
    description: string;
    imageUrl: string;
    category: string;
    price: string;
}
export enum UserRole {
    admin = "admin",
    user = "user",
    guest = "guest"
}
export interface backendInterface {
    addProduct(name: string, description: string, price: string, imageUrl: string, category: string): Promise<bigint>;
    assignCallerUserRole(user: Principal, role: UserRole): Promise<void>;
    deleteProduct(id: bigint): Promise<void>;
    getCallerUserProfile(): Promise<UserProfile | null>;
    getCallerUserRole(): Promise<UserRole>;
    getInquiries(): Promise<Array<ContactInquiry>>;
    getOrders(): Promise<Array<Order>>;
    getProduct(id: bigint): Promise<Product | null>;
    getProducts(): Promise<Array<Product>>;
    getUserProfile(user: Principal): Promise<UserProfile | null>;
    isAdmin(): Promise<boolean>;
    isCallerAdmin(): Promise<boolean>;
    placeOrder(productId: bigint, productName: string, productPrice: string, customerName: string, customerPhone: string, customerAddress: string): Promise<bigint>;
    saveCallerUserProfile(profile: UserProfile): Promise<void>;
    submitInquiry(name: string, email: string, message: string): Promise<void>;
    updateOrderStatus(orderId: bigint, status: string): Promise<void>;
    updateProduct(id: bigint, name: string, description: string, price: string, imageUrl: string, category: string, inStock: boolean): Promise<void>;
}
