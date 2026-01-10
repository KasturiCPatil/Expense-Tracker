export interface Product {
    id: string;
    title: string;
    author?: string;
    price: number;
    isbn?: string;
    availability?: string;
    imageUrl?: string;
    sourceUrl?: string;
    createdAt: string;
    updatedAt: string;
    description?: string;
    category?: string;
    condition?: string;
    isbn13?: string;
}
