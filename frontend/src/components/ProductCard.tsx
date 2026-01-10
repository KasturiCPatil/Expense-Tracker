import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            whileHover={{ y: -5 }}
            className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden group hover:shadow-md transition-shadow"
        >
            <div className="relative h-64 w-full bg-gray-50">
                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.title}
                        fill
                        className="object-contain p-4 group-hover:scale-105 transition-transform duration-300"
                    />
                ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                        No Image
                    </div>
                )}
            </div>
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-900 truncate" title={product.title}>
                    {product.title}
                </h3>
                <p className="text-sm text-gray-500 mb-2 truncate">
                    {product.author || 'Unknown Author'}
                </p>
                <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600">
                        £{Number(product.price).toFixed(2)}
                    </span>
                    <span className={`text-xs px-2 py-1 rounded-full ${product.availability === 'In Stock' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                        }`}>
                        {product.availability || 'Out of Stock'}
                    </span>
                </div>
                {product.sourceUrl && (
                    <Link
                        href={`/products/${product.id}`}
                        className="mt-4 block w-full text-center py-2 bg-gray-900 text-white rounded-lg text-sm font-medium hover:bg-gray-800 transition-colors"
                    >
                        View Details
                    </Link>
                )}
            </div>
        </motion.div>
    );
};

export default ProductCard;
