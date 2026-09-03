import type { ChangeEvent } from 'react';
import type { FilterState, SortOption } from '../types.ts';

interface FilterControlsProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
}

const LENGTH_OPTIONS = [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15];

export default function FilterControls({ filters, onChange }: FilterControlsProps) {
  const handleMinChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newMin = Number(e.target.value);
    onChange({
      ...filters,
      minLength: newMin,
      maxLength: Math.max(newMin, filters.maxLength),
    });
  };

  const handleMaxChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newMax = Number(e.target.value);
    onChange({
      ...filters,
      maxLength: newMax,
      minLength: Math.min(newMax, filters.minLength),
    });
  };

  const handleSortChange = (e: ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...filters,
      sortBy: e.target.value as SortOption,
    });
  };

  const handleResetFilters = () => {
    onChange({
      minLength: 2,
      maxLength: 15,
      sortBy: 'length-desc',
    });
  };

  const isCustom =
    filters.minLength !== 2 ||
    filters.maxLength !== 15 ||
    (filters.sortBy && filters.sortBy !== 'length-desc');

  return (
    <div
      id="filter-controls-container"
      className="pt-4 border-t border-slate-100 space-y-4"
    >
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-500">
          Filter & Sort Results
        </h3>
        {isCustom && (
          <button
            id="reset-filters-btn"
            type="button"
            onClick={handleResetFilters}
            className="text-xs text-indigo-600 hover:text-indigo-800 transition-colors font-medium"
          >
            Reset
          </button>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* Minimum Word Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="filter-min-length"
              className="text-xs text-slate-400 font-medium"
            >
              Min Length
            </label>
            <span className="text-xs font-semibold text-slate-700">{filters.minLength}</span>
          </div>
          <select
            id="filter-min-length"
            value={filters.minLength}
            onChange={handleMinChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          >
            {LENGTH_OPTIONS.map((val) => (
              <option key={`min-${val}`} value={val}>
                {val} letters
              </option>
            ))}
          </select>
        </div>

        {/* Maximum Word Length */}
        <div className="space-y-1.5">
          <div className="flex justify-between items-center">
            <label
              htmlFor="filter-max-length"
              className="text-xs text-slate-400 font-medium"
            >
              Max Length
            </label>
            <span className="text-xs font-semibold text-slate-700">{filters.maxLength}</span>
          </div>
          <select
            id="filter-max-length"
            value={filters.maxLength}
            onChange={handleMaxChange}
            className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
          >
            {LENGTH_OPTIONS.map((val) => (
              <option key={`max-${val}`} value={val} disabled={val < filters.minLength}>
                {val} letters
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Result Sorting Option */}
      <div className="space-y-1.5">
        <label
          htmlFor="filter-sort-order"
          className="text-xs text-slate-400 font-medium block"
        >
          Sort Order
        </label>
        <select
          id="filter-sort-order"
          value={filters.sortBy || 'length-desc'}
          onChange={handleSortChange}
          className="w-full bg-slate-50 border border-slate-200 rounded-lg px-3 py-2 text-sm text-slate-700 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-colors"
        >
          <option value="length-desc">Longest first (Default)</option>
          <option value="length-asc">Shortest first</option>
          <option value="alpha-asc">Alphabetical (A to Z)</option>
        </select>
      </div>
    </div>
  );
}

