import type { SearchParams } from "../types";
import SelectField from "./SelectField";
import CheckboxField from "./CheckboxField";

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

const AGENTS = [
  { value: "김부동", label: "김부동" },
  { value: "이공인", label: "이공인" },
  { value: "박소현", label: "박소현" },
  { value: "최중개", label: "최중개" },
];

interface FiltersPanelProps {
  filters: SearchParams;
  onFilterChange: (name: keyof SearchParams, value: any) => void;
}

const FiltersPanel = ({ filters, onFilterChange }: FiltersPanelProps) => {
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border mb-6">
      <h2 className="text-lg font-medium text-gray-900 mb-4">필터</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
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
        
        <SelectField
          id="agent"
          label="담당자"
          value={filters.agent}
          onChange={(value) => onFilterChange("agent", value)}
          options={AGENTS}
        />
        
        <div className="flex items-end">
          <CheckboxField
            id="sharedOnly"
            label="공유 매물만 보기"
            checked={filters.sharedOnly || false}
            onChange={(checked) => onFilterChange("sharedOnly", checked)}
          />
        </div>
      </div>
    </div>
  );
};

export default FiltersPanel;