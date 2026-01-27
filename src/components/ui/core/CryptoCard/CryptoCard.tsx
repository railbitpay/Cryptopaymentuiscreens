import React from 'react';
import { Label } from '../../label';
import { cn } from '../../utils';

interface CardProps {
    children?: React.ReactElement;
    classname?: string;
    error?: string
}
export const CryptoCard = ({children, classname, error, ...props}: CardProps) => {
    return (
        <div className={cn("space-y-4", classname)} {...props}>
            <Label>Accepted Cryptocurrencies</Label>
            {error &&<span className="text-red-600">{error}</span>}
            <div className="space-y-3">
                {children}
            </div>
        </div>
    )
}