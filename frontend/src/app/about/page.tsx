'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';

export default function AboutPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-20 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-8"
            >
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    About <span className="text-indigo-600">ProductExplorer</span>
                </h1>

                <p className="text-xl text-gray-600 leading-relaxed">
                    ProductExplorer is a state-of-the-art platform designed to help you discover
                    and track books from across the web. Using advanced crawling technology
                    and real-time data processing, we bring the entire catalog of "World of Books"
                    directly to your fingertips.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-12 text-left">
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-indigo-600 font-bold mb-2">Hierarchical Scraping</div>
                        <p className="text-gray-500 text-sm">Automated agents that traverse World of Books navigation, categories, and deep listings.</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-indigo-600 font-bold mb-2">Relational Persistence</div>
                        <p className="text-gray-500 text-sm">Complex schema supporting categories, product details, and user browsing history.</p>
                    </div>
                    <div className="p-6 bg-white rounded-3xl shadow-sm border border-gray-100">
                        <div className="text-indigo-600 font-bold mb-2">Production Engineering</div>
                        <p className="text-gray-500 text-sm">Built with NestJS, Next.js 15, PostgreSQL-ready schema, and Docker orchestration.</p>
                    </div>
                </div>

                <div className="pt-12">
                    <Link
                        href="/"
                        className="inline-flex items-center gap-2 px-8 py-4 bg-gray-900 text-white rounded-2xl font-bold hover:bg-gray-800 transition-all active:scale-95"
                    >
                        Back to Explorer
                    </Link>
                </div>
            </motion.div>
        </div>
    );
}
