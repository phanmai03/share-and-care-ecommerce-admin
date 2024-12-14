import { IoSearchOutline } from "react-icons/io5";


interface SearchBarProps {
  query: string;
  setQuery: (query: string) => void;
  placeholder?: string;
  width?: number;
}

export default function SearchBar({
  query,
  setQuery,
  placeholder = "Search...",
  width,
}: SearchBarProps) {
  return (
    <div className="relative flex items-center" style={{ width }}>
      <IoSearchOutline className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" />
      <input
        className="pl-10 pr-5 py-2 w-full rounded-2xl border border-gray-300 bg-gray-100 text-gray-700 placeholder-gray-500 transition-all focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        type="text"
        placeholder={placeholder}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{ borderColor: "black" }}
      />
    </div>
  );
}
