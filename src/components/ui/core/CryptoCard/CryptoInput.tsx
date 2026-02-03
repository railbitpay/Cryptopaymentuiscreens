import React, {ComponentProps} from 'react';
import { cn } from '../../utils';

interface CardInputProps extends ComponentProps<'input'> {
    checked: boolean;
    children?: React.ReactNode;
    classname?: string;
    onChange: (e: any) => void;
    onClick?: () => void
}

export const CardInput = ({checked, classname, onChange, onClick, ...props}: CardInputProps) => {
    return (
        <input
        {...props}
        type="checkbox"
        checked={checked}
        onChange={onChange}
        onClick={onClick}
        className={cn("w-5 h-5 text-blue-600 border-gray-300 rounded", classname)}
        />
    )
}