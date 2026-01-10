'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';
import { API_BASE_URL } from '@/config';
import { v4 as uuidv4 } from 'uuid';

export default function HistoryLogger() {
    const pathname = usePathname();

    useEffect(() => {
        let sessionId = localStorage.getItem('product_explorer_session');
        if (!sessionId) {
            sessionId = uuidv4();
            localStorage.setItem('product_explorer_session', sessionId);
        }

        const logHistory = async () => {
            try {
                await fetch(`${API_BASE_URL}/history`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        sessionId,
                        path: { pathname, timestamp: new Date().toISOString() },
                    }),
                });
            } catch (error) {
                console.error('Failed to log history:', error);
            }
        };

        logHistory();
    }, [pathname]);

    return null;
}
