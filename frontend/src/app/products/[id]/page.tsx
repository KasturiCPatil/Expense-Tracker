'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { Product } from '@/types/product';
import { API_BASE_URL } from '@/config';

export default function ProductDetailPage() {
    const { id } = useParams();
    const router = useRouter();
    const [product, setProduct] = useState<Product | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/products/${id}`);
                if (!response.ok) throw new Error('Product not found');
                const data = await response.json();
                setProduct(data);
            } catch (error) {
                console.error('Error fetching product:', error);
            } finally {
                setIsLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (isLoading) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-12 animate-pulse">
                <div className="flex flex-col md:flex-row gap-12">
                    <div className="w-full md:w-1/2 bg-gray-200 aspect-square rounded-3xl" />
                    <div className="w-full md:w-1/2 space-y-6">
                        <div className="h-10 bg-gray-200 w-3/4 rounded" />
                        <div className="h-6 bg-gray-200 w-1/4 rounded" />
                        <div className="h-32 bg-gray-200 rounded" />
                    </div>
                </div>
            </div>
        );
    }

    if (!product) {
        return (
            <div className="max-w-7xl mx-auto px-4 py-24 text-center">
                <h2 className="text-2xl font-bold mb-4">Product not found</h2>
                <Link href="/" className="text-indigo-600 hover:underline">Return Home</Link>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <button
                onClick={() => router.back()}
                className="mb-8 flex items-center gap-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
                </svg>
                Back to Results
            </button>

            <div className="flex flex-col lg:flex-row gap-12">
                {/* Image Section */}
                <div className="w-full lg:w-1/2">
                    <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm flex items-center justify-center aspect-square sticky top-24">
                        {product.imageUrl ? (
                            <div className="relative w-full h-full">
                                <Image
                                    src={product.imageUrl}
                                    alt={product.title}
                                    fill
                                    className="object-contain"
                                />
                            </div>
                        ) : (
                            <span className="text-gray-400">No Image Available</span>
                        )}
                    </div>
                </div>

                {/* Info Section */}
                <div className="w-full lg:w-1/2 space-y-8">
                    <div>
                        <div className="flex items-center gap-2 text-sm text-indigo-600 font-medium mb-2">
                            <span className="uppercase tracking-wider">{product.category || 'General'}</span>
                            <span>•</span>
                            <span>{product.condition || 'Used'}</span>
                        </div>
                        <h1 className="text-4xl font-extrabold text-gray-900 leading-tight mb-2">
                            {product.title}
                        </h1>
                        <p className="text-xl text-gray-500">By {product.author || 'Unknown Author'}</p>
                    </div>

                    <div className="flex items-center gap-6 py-6 border-y border-gray-100">
                        <div className="text-4xl font-black text-indigo-600">
                            £{Number(product.price).toFixed(2)}
                        </div>
                        <div className={`px-4 py-1.5 rounded-full text-sm font-semibold ${product.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                            }`}>
                            {product.availability || 'Out of Stock'}
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h2 className="text-xl font-bold text-gray-900 border-l-4 border-indigo-600 pl-3">Description</h2>
                        <p className="text-gray-600 leading-relaxed whitespace-pre-line">
                            {product.description || 'No description available for this item.'}
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4 pt-4 text-sm">
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <span className="block text-gray-400 mb-1">ISBN-13</span>
                            <span className="font-mono font-bold text-gray-900">{product.isbn13 || 'N/A'}</span>
                        </div>
                        <div className="p-4 bg-gray-50 rounded-2xl">
                            <span className="block text-gray-400 mb-1">Source</span>
                            <span className="font-bold text-gray-900">World of Books</span>
                        </div>
                    </div>

                    {product.sourceUrl && (
                        <a
                            href={product.sourceUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="flex items-center justify-center gap-3 w-full py-4 bg-indigo-600 text-white rounded-2xl font-bold text-lg hover:bg-indigo-700 transition-all shadow-lg shadow-indigo-100 hover:shadow-indigo-200 active:scale-[0.98]"
                        >
                            Buy on World of Books
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                <path d="M11 3a1 1 0 100 2h2.586l-6.293 6.293a1 1 0 101.414 1.414L15 6.414V9a1 1 0 102 0V4a1 1 0 00-1-1h-5z" />
                                <path d="M5 5a2 2 0 00-2 2v8a2 2 0 002 2h8a2 2 0 002-2v-3a1 1 0 10-2 0v3H5V7h3a1 1 0 000-2H5z" />
                            </svg>
                        </a>
                    )}
                </div>
            </div>
        </div>
    );
}
