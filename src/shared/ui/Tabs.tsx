"use client";

import { useId, useRef } from "react";
import type { KeyboardEvent, ReactNode } from "react";

import { cn } from "@/shared/lib/cn";

export type TabItem = {
  value: string;
  label: string;
  count: number;
};

type TabsProps = {
  label: string;
  items: TabItem[];
  selectedValue: string;
  onSelect: (value: string) => void;
  children: ReactNode;
};

// 방향키로 다음 탭을 고르면 바로 선택되도록(자동 선택) ARIA 탭 패턴을 따른다
const KEY_TO_STEP: Record<string, (index: number, length: number) => number> = {
  ArrowRight: (index, length) => (index + 1) % length,
  ArrowLeft: (index, length) => (index - 1 + length) % length,
  Home: () => 0,
  End: (_, length) => length - 1,
};

export function Tabs({ label, items, selectedValue, onSelect, children }: TabsProps) {
  const id = useId();
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const panelId = `${id}-panel`;
  const getTabId = (index: number) => `${id}-tab-${index}`;
  const selectedIndex = Math.max(
    items.findIndex((item) => item.value === selectedValue),
    0,
  );

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>, index: number) {
    const step = KEY_TO_STEP[event.key];
    if (!step) return;

    event.preventDefault();
    const nextIndex = step(index, items.length);
    onSelect(items[nextIndex].value);
    tabRefs.current[nextIndex]?.focus();
  }

  return (
    <div className="flex flex-col gap-6">
      <div role="tablist" aria-label={label} className="flex flex-wrap gap-2.5">
        {items.map((item, index) => {
          const isSelected = index === selectedIndex;

          return (
            <button
              key={item.value}
              ref={(element) => {
                tabRefs.current[index] = element;
              }}
              id={getTabId(index)}
              type="button"
              role="tab"
              aria-selected={isSelected}
              aria-controls={panelId}
              aria-label={`${item.label} ${item.count}개`}
              tabIndex={isSelected ? 0 : -1}
              className={cn(
                "inline-flex min-h-12 cursor-pointer items-center gap-2 rounded-full border px-5 font-bold transition",
                isSelected
                  ? "border-primary bg-primary text-surface"
                  : "border-border bg-surface text-text hover:border-text-muted/40",
              )}
              onClick={() => onSelect(item.value)}
              onKeyDown={(event) => handleKeyDown(event, index)}
            >
              {item.label}
              <span className={isSelected ? "text-primary-soft" : "text-text-muted"}>
                {item.count}
              </span>
            </button>
          );
        })}
      </div>
      <div role="tabpanel" id={panelId} aria-labelledby={getTabId(selectedIndex)}>
        {children}
      </div>
    </div>
  );
}
