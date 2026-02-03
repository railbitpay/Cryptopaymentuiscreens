import React, { ComponentProps, ReactNode } from 'react'
import { Label } from '../../ui/label';
import { Button } from '../../ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '../../ui/utils';

interface FormProps extends ComponentProps<'form'> {
    loading?: boolean;
    children?: ReactNode;
    classname?: string;
    onSubmit: (e: any) => void;
    labelOneText?: string
    labelTwoText?: string
}

export const Form = ({loading, children, className, onSubmit, labelOneText='Email', labelTwoText='Password', ...props}: FormProps) => {
    return (
        <form {...props} onSubmit={onSubmit} className={cn("space-y-4", className)}>
            <div className="space-y-2">
                <Label htmlFor="email">{labelOneText}</Label>
                {children?.[0 as keyof ReactNode]}
            </div>
            <div className="space-y-2">
                <Label htmlFor="password">{labelTwoText}</Label>
                {children?.[1 as keyof ReactNode]}
            </div>
            <Button type="submit" className="w-full" disabled={loading}>
                {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Login
            </Button>
        </form>
    )
}