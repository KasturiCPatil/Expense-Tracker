'use client';

import React from 'react';
import { motion } from 'framer-motion';

export default function ContactPage() {
    return (
        <div className="max-w-4xl mx-auto px-4 py-24 text-center">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2rem] p-12 border border-gray-100 shadow-xl"
            >
                <div className="w-20 h-20 bg-indigo-100 text-indigo-600 rounded-3xl flex items-center justify-center mx-auto mb-8">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                </div>
                <h1 className="text-4xl font-extrabold text-gray-900 mb-6">Get in Touch</h1>
                <p className="text-xl text-gray-500 mb-12 max-w-lg mx-auto">
                    Have questions about our scraping technology or the Product Explorer platform? We'd love to hear from you.
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <div className="text-sm text-gray-400 mb-1 font-bold uppercase tracking-wider">Email</div>
                        <div className="text-indigo-600 font-bold">support@productexplorer.io</div>
                    </div>
                    <div className="p-6 bg-gray-50 rounded-2xl">
                        <div className="text-sm text-gray-400 mb-1 font-bold uppercase tracking-wider">Support</div>
                        <div className="text-indigo-600 font-bold">24/7 Monitoring Active</div>
                    </div>
                </div>

                <div className="mt-12 pt-12 border-t border-gray-100">
                    <p className="text-gray-400 text-sm">
                        Built as part of a high-performance full-stack assignment.
                    </p>
                </div>
            </motion.div>
        </div>
    );
}
