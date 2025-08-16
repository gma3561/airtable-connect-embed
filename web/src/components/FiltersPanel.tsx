import type { SearchParams } from "../types";
import SelectField from "./SelectField";

// Mock data for select options - would typically come from an API or constants file
const PROPERTY_TYPES = [
  { value: "아파트", label: "아파트" },
  { value: "빌라", label: "빌라" },
  { value: "오피스텔", label: "오피스텔" },
  { value: "단독주택", label: "단독주택" },
  { value: "상가", label: "상가" },
];

const TRANSACTION_TYPES = [
  { value: "매매", label: "매매" },
  { value: "전세", label: "전세" },
  { value: "월세", label: "월세" },
  { value: "단기임대", label: "단기임대" },
];

const PROPERTY_STATUS = [
  { value: "거래가능", label: "거래가능" },
  { value: "계약중", label: "계약중" },
  { value: "거래완료", label: "거래완료" },
  { value: "보류", label: "보류" },
];

interface FiltersPanelProps {
  filters: SearchParams;
  onFilterChange: (name: keyof SearchParams, value: string | boolean) => void;
}

const FiltersPanel = ({ filters, onFilterChange }: FiltersPanelProps) => {
  return (
    <div className="bg-white px-4 py-3 rounded-lg shadow-sm border mb-6">
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-3">
        <div className="flex flex-wrap gap-3">
          <SelectField
            id="propertyType"
            label="매물 종류"
            value={filters.propertyType}
            onChange={(value) => onFilterChange("propertyType", value)}
            options={PROPERTY_TYPES}
          />
          <SelectField
            id="transactionType"
            label="거래 유형"
            value={filters.transactionType}
            onChange={(value) => onFilterChange("transactionType", value)}
            options={TRANSACTION_TYPES}
          />
          <SelectField
            id="propertyStatus"
            label="진행 상태"
            value={filters.propertyStatus}
            onChange={(value) => onFilterChange("propertyStatus", value)}
            options={PROPERTY_STATUS}
          />
        </div>
        <div className="flex items-center gap-2">
          <button type="button" className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">Filter</button>
          <button type="button" className="px-3 py-2 text-sm border rounded-lg hover:bg-gray-50">
            Sort <span className="ml-1 inline-flex items-center justify-center w-5 h-5 rounded-full bg-gray-200 text-gray-700 text-xs">1</span>
          </button>
          <button type="button" aria-label="검색" className="p-2 border rounded-lg hover:bg-gray-50">
            <svg className="w-4 h-4" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;