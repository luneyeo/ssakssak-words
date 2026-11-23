import { FOCUS_RING } from "@/components/ui/focusRing";
import { cn } from "@/lib/cn";
import { splitByTargets } from "@/lib/text";
import type { HighlightTarget } from "@/lib/text";

type HighlightedTextProps = {
  text: string;
  targets: HighlightTarget[];
  // 카드 뒷면은 전체가 버튼이라 안에 버튼을 또 넣을 수 없으므로, 없으면 표시만 한다
  onSelect?: (targetId: string) => void;
};

const HIGHLIGHT_CLASSES = "bg-primary-soft text-text rounded-sm";

export function HighlightedText({ text, targets, onSelect }: HighlightedTextProps) {
  return splitByTargets(text, targets).map((segment, index) => {
    const { targetId } = segment;

    if (targetId === undefined) return <span key={index}>{segment.text}</span>;

    if (onSelect === undefined) {
      return (
        <mark key={index} className={HIGHLIGHT_CLASSES}>
          {segment.text}
        </mark>
      );
    }

    return (
      <button
        key={index}
        type="button"
        className={cn(
          HIGHLIGHT_CLASSES,
          FOCUS_RING,
          "hover:text-primary-strong cursor-pointer hover:underline",
        )}
        onClick={() => onSelect(targetId)}
      >
        {segment.text}
      </button>
    );
  });
}
