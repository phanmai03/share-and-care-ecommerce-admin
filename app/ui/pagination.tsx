import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
    currentPage: number;
    totalItems: number;
    itemsPerPage: number;
    onPageChange: (page: number) => void;
}

const Pagination: React.FC<PaginationProps> = ({
    currentPage,
    totalItems,
    itemsPerPage,
    onPageChange,
}) => {
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) onPageChange(currentPage + 1);
    };

    const handlePreviousPage = () => {
        if (currentPage > 1) onPageChange(currentPage - 1);
    };

    return (
        <div className="flex items-center justify-between mt-4">
            {/* Page information */}
            <span className="text-gray-700 text-lg">
                {`${(currentPage - 1) * itemsPerPage + 1}-${Math.min(
                    currentPage * itemsPerPage,
                    totalItems
                )} of ${totalItems}`}
            </span>

            {/* Pagination buttons */}
            <div className="flex items-center space-x-2">
                {/* Previous Page */}
                <button
                    onClick={handlePreviousPage}
                    className={`px-4 py-2 rounded-md ${
                        currentPage === 1
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-800 hover:text-black hover:bg-gray-200'
                    }`}
                    disabled={currentPage === 1}
                >
                    <ChevronLeft className="w-6 h-6" />
                </button>

                {/* Page number */}
                <span className="text-lg text-gray-800">
                    Page {currentPage} of {totalPages}
                </span>

                {/* Next Page */}
                <button
                    onClick={handleNextPage}
                    className={`px-4 py-2 rounded-md ${
                        currentPage === totalPages
                            ? 'text-gray-300 cursor-not-allowed'
                            : 'text-gray-800 hover:text-black hover:bg-gray-200'
                    }`}
                    disabled={currentPage === totalPages}
                >
                    <ChevronRight className="w-6 h-6" />
                </button>
            </div>
        </div>
    );
};

export default Pagination;
