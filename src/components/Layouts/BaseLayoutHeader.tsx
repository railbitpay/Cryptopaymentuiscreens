import React from "react";
import { cn } from "../ui/utils";

type AppLayoutHeaderProps = React.ComponentProps<'header'> & {
    content?: React.ReactNode | undefined;
    startSlot?: React.ReactNode;
    endSlot?: React.ReactNode;
    appName?: string
}


export const BaseLayoutHeader = ({content, appName, className, startSlot = <span>Logo</span>, endSlot}: AppLayoutHeaderProps) => {
    return (
        <header className={cn("relative h-20 min-h-20 w-full m-auto mt-9 relative md:hidden border-b border-gray-200",className)}>
            <nav className="relative w-full h-full m-0 flex justify-between items-center">
                {/* <>{startSlot}</>
                <>{content}</>
                <div>{endSlot}</div> */}
                <div className="flex items-center gap-3">
                    <div className="md:hidden">{startSlot}</div>
                    <div>
                        <p className="text-sm text-gray-500">{appName}</p>
                        <p className="text-lg font-semibold text-gray-900">
                            {content}
                        </p>
                    </div>
                </div>
                {endSlot}
            </nav>
        </header>
    )
}