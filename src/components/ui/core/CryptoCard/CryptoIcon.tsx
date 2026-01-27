import React, {ComponentProps} from 'react'
import { cn } from '../../utils'

export const CryptoIcon: React.FC<ComponentProps<'div'>> = ({children, classname, ...props}) => {
    return (
        <div {...props} className={cn("w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center", classname)}>
            {children}
        </div>
    )
}