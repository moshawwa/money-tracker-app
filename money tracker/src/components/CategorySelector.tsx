import React from "react";
import { Check, ChevronDown } from "lucide-react";
import { CATEGORIES } from "../context/TransactionContext";

interface CategorySelectorProps {
  value: string;
  onChange: (value: string) => void;
  className?: string;
}

const CategorySelector: React.FC<CategorySelectorProps> = ({
  value,
  onChange,
  className,
}) => {
  return (
    <div className={`dropdown ${className}`}>
      <button
        className="form-select d-flex align-items-center justify-content-between w-100"
        type="button"
        id="categoryDropdown"
        data-bs-toggle="dropdown"
        aria-expanded="false"
      >
        {value || "Select category"}
        <ChevronDown size={16} className="ms-2" />
      </button>
      <ul
        className="dropdown-menu w-100"
        aria-labelledby="categoryDropdown"
        style={{ maxHeight: "320px", overflowY: "auto" }}
      >
        {Object.values(CATEGORIES).map((category) => (
          <li key={category}>
            <button
              className="dropdown-item d-flex align-items-center justify-content-between"
              onClick={() => onChange(category)}
            >
              {category}
              {value === category && <Check size={16} />}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CategorySelector;
