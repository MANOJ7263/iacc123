import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'; // We'll mock these if needed based on CSS

const StatCard = ({ title, value, subtext, type = 'neutral' }) => {
    // Determine color based on type if we want specific accents
    return (
        <div className="card">
            <div className="card-content">
                <div style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-muted)' }}>
                    {title}
                </div>
                <div style={{ fontSize: '2rem', fontWeight: 'bold', margin: '0.5rem 0' }}>
                    {value}
                </div>
                {subtext && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                        {subtext}
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatCard;
