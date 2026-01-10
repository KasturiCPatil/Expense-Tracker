'use client';

import React, { useState } from 'react';
import Link from 'next/link';

const Navbar: React.FC = () => {
    return (
        <nav className="fixed top-0 left-0 right-0 bg-white/80 backdrop-blur-md border-b border-gray-100 z-50">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16 items-center">
                    <div className="flex items-center gap-2">
                        <Link href="/" className="flex items-center gap-2">
                            <div className="w-8 h-8 bg-indigo-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold">P</span>
                            </div>
                            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-violet-600">
                                ProductExplorer
                            </span>
                        </Link>
                    </div>
                    <div className="flex items-center gap-6">
                        <Link href="/" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Home</Link>
                        <Link href="/about" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">About</Link>
                        <Link href="/contact" className="text-gray-600 hover:text-indigo-600 font-medium transition-colors">Contact</Link>
                        <Link
                            href="http://localhost:3001/api"
                            target="_blank"
                            className="px-4 py-2 bg-gray-900 text-white rounded-xl text-sm font-bold hover:bg-gray-800 transition-all"
                        >
                            API Docs
                        </Link>
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
