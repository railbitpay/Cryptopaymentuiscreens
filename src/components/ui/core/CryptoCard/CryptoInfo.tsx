import React from 'react';
import { Label } from '../../label';
import { Bitcoin } from 'lucide-react';
import { cn } from '../../utils';

interface CardProps {
    children?: React.ReactNode;
    classname?: string;
    error?: string
}
export const CryptoInfo = ({children, classname, error, ...props}: CardProps) => {
    return (
        <div {...props} className={cn("flex items-center gap-3 flex-1", classname)}>
            {children?.[0 as keyof React.ReactNode]}
            <div>
                {children?.[1 as keyof React.ReactNode]}
                {children?.[2 as keyof React.ReactNode]}
            </div>
        </div>
    )
}