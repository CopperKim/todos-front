import { useMemo } from "react";

// chatGPT

export type DayPickerProps = {
  value?: boolean[];                 // 길이 7, 미지정 시 모두 false
  onChange?: (next: boolean[]) => void;
  labels: [string, string, string, string, string, string, string];
  disabled?: boolean;
  className?: string;
  showShortcuts?: boolean;          // 전체/평일/주말/초기화 버튼 표시
};

const DEFAULT_LABELS: DayPickerProps["labels"] = [
  "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun",
];

function normalize7(v?: boolean[]): boolean[] {
  const base = new Array(7).fill(true);
  if (!v) return base;
  for (let i = 0; i < 7; i++) base[i] = !!v[i];
  return base;
}

export function DayPicker({
  value = normalize7(),
  onChange,
  labels = DEFAULT_LABELS,
  disabled = false,
  className,
  showShortcuts = true,
}: DayPickerProps) {
  const val = useMemo(() => normalize7(value), [value]);

  const toggle = (i: number) => {
    if (disabled) return;
    const next = [...val];
    next[i] = !next[i];
    console.log(next) 
    onChange?.(next);
  };

  const setAll = (b: boolean) => onChange?.(new Array(7).fill(b));
  const setWeekdays = () => onChange?.([true, true, true, true, true, false, false]);
  const setWeekends = () => onChange?.([false, false, false, false, false, true, true]);

  return (
    <div className={"flex flex-col gap-3 " + (className ?? "") }>
      {/* 버튼 그리드 */}
      <div className="grid grid-cols-7 gap-2">
        {labels.map((label, i) => {
          const selected = !!val[i];
          return (
            <button
              key={label}
              type="button"
              aria-pressed={selected}
              aria-label={label}
              disabled={disabled}
              onClick={() => toggle(i)}
              onKeyDown={(e) => {
                if (e.key === " " || e.key === "Enter") {
                  e.preventDefault();
                  toggle(i);
                }
              }}
              style={{
                height: "40px",
                borderRadius: "12px",
                border: "1px solid",
                borderColor: selected ? "#99FF99" : "#CCCCCC",
                backgroundColor: selected ? "#99FF99" : "#CCCCCC",
                color: selected ? "white" : "black",
                fontWeight: 600,
                cursor: "pointer",
                transition: "all 0.2s ease",
              }}
            >
              {label}
            </button>
          );
        })}
      </div>

      {!disabled && showShortcuts && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
            onClick={() => setAll(true)}
            disabled={disabled}
          >
            전체 선택
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
            onClick={() => setWeekdays()}
            disabled={disabled}
          >
            평일만
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
            onClick={() => setWeekends()}
            disabled={disabled}
          >
            주말만
          </button>
          <button
            type="button"
            className="px-3 py-2 text-sm rounded-xl border border-gray-300 hover:bg-gray-50"
            onClick={() => setAll(false)}
            disabled={disabled}
          >
            초기화
          </button>
        </div>
      )}
    </div>
  );
}