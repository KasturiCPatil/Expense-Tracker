'use client';

import React, { useState } from 'react';
import useSWR from 'swr';
import SearchBar from '@/components/SearchBar';
import ProductCard from '@/components/ProductCard';
import CategoryCard from '@/components/CategoryCard';
import { motion } from 'framer-motion';
import { Product } from '@/types/product';
import { API_BASE_URL } from '@/config';

const fetcher = (url: string) => fetch(url).then((res) => res.json());

export default function HomePage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [isScraping, setIsScraping] = useState(false);

  const { data: navigation, isLoading: navLoading } = useSWR<any[]>(
    `${API_BASE_URL}/navigation`,
    fetcher
  );

  const { data: products, isLoading: productsLoading, mutate: refreshProducts } = useSWR<Product[]>(
    `${API_BASE_URL}/products${searchQuery ? `?q=${searchQuery}` : ''}`,
    fetcher
  );

  const handleSearch = async (query: string) => {
    setSearchQuery(query);
    setIsScraping(true);
    try {
      const scrapeResponse = await fetch(`${API_BASE_URL}/scraper/trigger?q=${query}`, {
        method: 'POST',
      });
      const { jobId } = await scrapeResponse.json();

      const pollStatus = setInterval(async () => {
        const statusResponse = await fetch(`${API_BASE_URL}/scraper/job-status?id=${jobId}`);
        const { state } = await statusResponse.json();

        if (state === 'completed' || state === 'failed') {
          clearInterval(pollStatus);
          setIsScraping(false);
          refreshProducts();
        }
      }, 2000);
    } catch (error) {
      console.error('Scraping error:', error);
      setIsScraping(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-4xl md:text-6xl font-extrabold text-gray-900 mb-6 tracking-tight"
        >
          World of Books <span className="text-indigo-600">Explorer</span>
        </motion.h1>
        <p className="text-xl text-gray-500 max-w-2xl mx-auto mb-10">
          Discover a world of stories. Browse categories or search for your next favorite book.
        </p>
        <SearchBar onSearch={handleSearch} isLoading={isScraping} />
      </div>

      {/* Navigation Sections */}
      {!navLoading && navigation && navigation.length > 0 && (
        <section className="mb-20">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-gray-900">Browse by Category</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {navigation.map((nav) => (
              <div key={nav.id} className="space-y-4">
                <h3 className="text-lg font-bold text-indigo-600 px-2">{nav.title}</h3>
                <div className="space-y-3">
                  {nav.categories?.slice(0, 5).map((cat: any) => (
                    <CategoryCard key={cat.id} category={cat} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Product Results */}
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">
          {searchQuery ? `Results for "${searchQuery}"` : 'Recently Discovered'}
        </h2>
        <div className="text-sm text-gray-500">
          {products?.length || 0} products found
        </div>
      </div>

      {productsLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="bg-white rounded-xl h-96 animate-pulse border border-gray-100" />
          ))}
        </div>
      ) : products && products.length > 0 ? (
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
          <p className="text-gray-500">No products available yet. Try searching above!</p>
        </div>
      )}
    </div>
  );
}
