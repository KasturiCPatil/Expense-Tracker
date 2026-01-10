'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

interface CategoryCardProps {
    category: {
        title: string;
        slug: string;
        productCount?: number;
    };
}

const CategoryCard: React.FC<CategoryCardProps> = ({ category }) => {
    return (
        <motion.div
            whileHover={{ y: -5 }}
            className="group relative bg-white p-6 rounded-3xl border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
        >
            <Link href={`/categories/${category.slug}`} className="absolute inset-0 z-10" />
            <div className="flex flex-col h-full justify-between">
                <div>
                    <h3 className="text-lg font-bold text-gray-900 group-hover:text-indigo-600 transition-colors">
                        {category.title}
                    </h3>
                    <p className="text-sm text-gray-500 mt-2">
                        {category.productCount || 0} Products
                    </p>
                </div>
                <div className="mt-4 flex items-center text-indigo-600 font-semibold text-sm">
                    Browse Category
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                </div>
            </div>
        </motion.div>
    );
};

export default CategoryCard;
