'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import { useParams } from 'next/navigation';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { API_BASE_URL } from '@/config';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function CategoryPage() {
    const { slug } = useParams();
    const [isScraping, setIsScraping] = useState(false);

    const { data: category, error, isLoading, mutate: refreshCategory } = useSWR(
        slug ? `${API_BASE_URL}/categories/${slug}` : null,
        fetcher
    );

    const handleRefresh = async () => {
        setIsScraping(true);
        try {
            const resp = await fetch(`${API_BASE_URL}/scraper/category/${slug}`, { method: 'POST' });
            const { jobId } = await resp.json();

            // Poll for job
            if (jobId) {
                const pollStatus = setInterval(async () => {
                    const statusResponse = await fetch(`${API_BASE_URL}/scraper/job-status?id=${jobId}`);
                    const { state } = await statusResponse.json();

                    if (state === 'completed' || state === 'failed') {
                        clearInterval(pollStatus);
                        setIsScraping(false);
                        refreshCategory();
                    }
                }, 2000);
            } else {
                setIsScraping(false);
                refreshCategory();
            }
        } catch (error) {
            console.error('Refresh failed:', error);
            setIsScraping(false);
        }
    };

    if (error) return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Failed to load category.</div>;
    if (!category && !isLoading) return <div className="max-w-7xl mx-auto px-4 py-24 text-center">Category not found.</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-12">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
                <div>
                    <h1 className="text-4xl font-extrabold text-gray-900 capitalize">
                        {category?.title || slug}
                    </h1>
                    <p className="text-gray-500 mt-2">
                        Browse products in this category from World of Books.
                    </p>
                </div>
                <button
                    onClick={handleRefresh}
                    disabled={isScraping}
                    className="px-6 py-3 bg-indigo-600 text-white rounded-2xl font-bold hover:bg-indigo-700 transition-all disabled:opacity-50 flex items-center gap-2 shadow-lg shadow-indigo-100"
                >
                    {isScraping ? (
                        <>
                            <svg className="animate-spin h-5 w-5 text-white" viewBox="0 0 24 24">
                                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                            </svg>
                            Syncing...
                        </>
                    ) : 'Refresh Category'}
                </button>
            </div>

            {isLoading ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                    {[...Array(8)].map((_, i) => (
                        <div key={i} className="h-96 bg-gray-100 rounded-3xl animate-pulse" />
                    ))}
                </div>
            ) : category?.products?.length > 0 ? (
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8"
                >
                    {category.products.map((product: any) => (
                        <ProductCard key={product.id} product={product} />
                    ))}
                </motion.div>
            ) : (
                <div className="text-center py-20 bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
                    <p className="text-gray-500 text-lg">No products found in this category yet.</p>
                    <button
                        onClick={handleRefresh}
                        className="mt-4 text-indigo-600 font-bold hover:underline"
                    >
                        Trigger real-time scrape
                    </button>
                </div>
            )}
        </div>
    );
}
