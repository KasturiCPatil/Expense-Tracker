'use client';

import React, { useState, useEffect } from 'react';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { API_BASE_URL } from '@/config';

export default function HomePage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isScraping, setIsScraping] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchProducts = async (query = '') => {
    setIsLoading(true);
    try {
      const response = await fetch(`${API_BASE_URL}/products${query ? `?q=${query}` : ''}`);
      const data = await response.json();
      setProducts(data);
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsScraping(true);
    try {
      // 1. Trigger scraping
      const scrapeResponse = await fetch(`${API_BASE_URL}/scraper/trigger?q=${query}`, {
        method: 'POST',
      });
      const { jobId } = await scrapeResponse.json();

      // 2. Poll for job completion
      const pollStatus = setInterval(async () => {
        const statusResponse = await fetch(`${API_BASE_URL}/scraper/job-status?id=${jobId}`);
        const { state } = await statusResponse.json();

        if (state === 'completed' || state === 'failed') {
          clearInterval(pollStatus);
          setIsScraping(false);
          // 3. Refresh product list
          fetchProducts(query);
        }
      }, 2000);
    } catch (error) {
      console.error('Scraping error:', error);
      setIsScraping(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight">
          Find Your Next <span className="text-indigo-600">Great Read</span>
        </h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Search thousands of books across World of Books. Instantly compare prices and availability.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isScraping} />
      </div>

      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery ? `Results for "${searchQuery}"` : 'Recent Products'}
        </h2>
        <div className="text-sm text-gray-500">
          Showing {products.length} products
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : products.length > 0 ? (
        <motion.div
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: {
                staggerChildren: 0.1
              }
            }
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
        >
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </motion.div>
      ) : (
        <div className="text-center py-20 bg-white rounded-3xl border border-dashed border-gray-200">
          <div className="text-gray-400 mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
            </svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-900">No products found</h3>
          <p className="text-gray-500">Try searching for a book title or author above.</p>
        </div>
      )}
    </div>
  );
}
