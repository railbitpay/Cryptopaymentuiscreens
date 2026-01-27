import React, {ComponentProps, ReactNode} from 'react'
import { cn } from '../../utils'


export const CryptoText: React.FC<ComponentProps<'p'>> = ({children, className, ...props}) => {
    return (
        <p {...props} className={cn("text-xs text-gray-500", className)}>
            {children}
        </p>
    )
}