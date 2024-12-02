import { Checkbox } from '@headlessui/react';
import { Check } from 'lucide-react';
import React from 'react';

interface SelectedAllComboboxProps {
  selectedAll: boolean;
  setSelectedAll: (selectedAll: boolean) => void;
}

const SelectedAllCombobox: React.FC<SelectedAllComboboxProps> = ({
  selectedAll,
  setSelectedAll,
}) => {
  return (
    <div
      onClick={() => setSelectedAll(!selectedAll)}
      className="flex justify-center items-center space-x-2 hover:cursor-pointer"
    >
      <Checkbox
        checked={selectedAll}
        onChange={() => setSelectedAll(!selectedAll)}
        className="relative flex items-center justify-center h-6 w-6 rounded border border-gray-700 bg-white checked:bg-gray-200"
      >
        {selectedAll && (
          <Check className="absolute w-4 h-4 text-gray-700" />
        )}
      </Checkbox>
      <h4 className="mt-1 select-none">Select All</h4>
    </div>
  );
};

export default SelectedAllCombobox;
