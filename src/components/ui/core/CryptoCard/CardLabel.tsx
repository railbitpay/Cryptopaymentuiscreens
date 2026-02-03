import React, { ComponentProps } from 'react'
import { cn } from "../../utils";


interface CardLabelProps extends ComponentProps<'label'> {
    children?: React.ReactNode;
    classname?: string;
}

export const CardLabel = ({children, classname, ...props}: CardLabelProps) => {
    return (
        <label 
            {...props}
            className={cn("flex items-center gap-4 p-4 rounded-lg border border-gray-200 hover:bg-gray-50 cursor-pointer", classname)}>
            {children?.[0 as keyof React.ReactNode]}
            {children?.[1 as keyof React.ReactNode]}
        </label>
    )
}