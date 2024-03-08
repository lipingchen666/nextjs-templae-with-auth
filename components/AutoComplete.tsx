'use client';
import React from 'react';
import { twMerge } from 'tailwind-merge';

interface AutoCompleteProps {
    placeholder: string;
    className: string;
}
const AutoComplete = ({
    placeholder="",
    className=""
}: AutoCompleteProps) => {
    return (
        <div>
            <input
                autoComplete="off"
                placeholder={placeholder}
                className={twMerge(
                    'unifiedNav-searchInput rounded-l-xl-35 border-none shadow-none font-semibold h-full outline-none w-full py-2 text-sm px-3',
                    className
                )}
                defaultValue={""}
            />
        </div>
    )
}

export default AutoComplete;