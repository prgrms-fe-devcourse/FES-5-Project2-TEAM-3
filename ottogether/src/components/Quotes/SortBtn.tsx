
import { useState } from "react";
import S from "./SortBtn.module.css";

type SortOption = {
  sortBy: "created_at" | "likes";
  order: "asc" | "desc";
};

interface SortBtnProps {
  onChange: (option: SortOption) => void;
}

const SortBtn = ({ onChange }: SortBtnProps) => {
  const [open, setOpen] = useState(false);

  const sortOptions: { label: string; option: SortOption }[] = [
    { label: "최신 순", option: { sortBy: "created_at", order: "desc" } },
    { label: "오래된 순", option: { sortBy: "created_at", order: "asc" } },
    { label: "좋아요 높은 순", option: { sortBy: "likes", order: "desc" } },
    { label: "좋아요 낮은 순", option: { sortBy: "likes", order: "asc" } },
  ];

  const handleSelect = (option: SortOption) => {
    onChange(option);
    setOpen(false);
  };

  return (
    <div className={S.sortWrapper}>
      <button className={S.sortToggleBtn} onClick={() => setOpen((prev) => !prev)}>
        Sort by ▼
      </button>

      {open && (
        <ul className={S.dropdown}>
          {sortOptions.map(({ label, option }) => (
            <li key={label}>
              <button
                className={S.option}
                onClick={() => handleSelect(option)}
              >
                {label}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SortBtn;
