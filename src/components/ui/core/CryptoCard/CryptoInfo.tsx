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
            {children[0]}
            <div>
                {children[1]}
                {children[2]}
            </div>
        </div>
    )
}