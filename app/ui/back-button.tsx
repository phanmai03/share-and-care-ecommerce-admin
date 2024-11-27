'use client';

import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

interface BackButtonProps {
    previousPathname: string;
}

const BackButton: React.FC<BackButtonProps> = ({ previousPathname }) => {
    return (
        <Link
            href={previousPathname}
            passHref
            className="flex items-center space-x-1 hover:bg-gray-300 hover:rounded-md px-2 py-1 transition"
        >
            <ChevronLeft className="w-5 h-5" />
            <span className="text-sm font-medium">Back</span>
        </Link>
    );
};

export default BackButton;
