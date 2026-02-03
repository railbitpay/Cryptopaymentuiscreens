import React, {ComponentProps} from 'react'
import { cn } from '../../utils'


export const CryptoName: React.FC<ComponentProps<'p'>> = ({children, className, ...props}) => {
    return (
        <p {...props} className={cn("text-sm text-gray-900", className)}>
            {children}
        </p>
    )
}