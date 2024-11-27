import React from 'react';

interface SearchProps {
  searchQuery: string;
  onSearchChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string; // Optional placeholder prop with default value
}

const Search: React.FC<SearchProps> = ({ searchQuery, onSearchChange, placeholder = "Search..." }) => {
  return (
    <div className="flex items-center mb-4">
      <input
        type="text"
        value={searchQuery}
        onChange={onSearchChange}
        placeholder={placeholder}
        className="border border-gray-300 rounded-md p-2 w-full"
      />
    </div>
  );
};

export default Search;
