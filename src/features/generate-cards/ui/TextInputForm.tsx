"use client";

import { useId, useImperativeHandle, useRef, useState } from "react";
import type { Ref, SubmitEvent } from "react";

import { Button } from "@/shared/ui/Button";
import { LockIcon, SparkleIcon } from "@/shared/icons";
import { Select } from "@/shared/ui/Select";
import { Textarea } from "@/shared/ui/Textarea";
import { DemoArticlePicker } from "@/features/generate-cards/ui/DemoArticlePicker";
import { MAX_TEXT_LENGTH, SUPPORTED_LANGUAGES } from "@/entities/word-card/model/constants";
import type { CardSet } from "@/entities/word-card/model/types";
import { ERROR_DETAILS } from "@/ai/errors";
import type { GenerateCardsInput } from "@/ai/types";
import { cn } from "@/shared/lib/cn";

export type TextInputFormHandle = {
  focusLanguage: () => void;
  selectText: () => void;
};

type TextInputFormProps = {
  ref?: Ref<TextInputFormHandle>;
  isLoading: boolean;
  onSubmit: (input: GenerateCardsInput) => void;
  onDemoSelect: (cardSet: CardSet) => void;
};

export function TextInputForm({ ref, isLoading, onSubmit, onDemoSelect }: TextInputFormProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0]);
  const languageRef = useRef<HTMLSelectElement>(null);
  const textRef = useRef<HTMLTextAreaElement>(null);
  const id = useId();
  const languageId = `${id}-language`;
  const textId = `${id}-text`;
  const lengthId = `${id}-length`;
  const privacyId = `${id}-privacy`;

  useImperativeHandle(
    ref,
    () => ({
      focusLanguage: () => languageRef.current?.focus(),
      selectText: () => {
        textRef.current?.focus();
        textRef.current?.select();
      },
    }),
    [],
  );

  const textLength = text.trim().length;
  const isTooLong = textLength > MAX_TEXT_LENGTH;
  const canSubmit = textLength > 0 && !isTooLong && !isLoading;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) onSubmit({ text: text.trim(), language });
  }

  // 예시 결과를 보면서 원문을 고쳐 바로 다시 담아 볼 수 있도록 입력창에도 채운다
  function handleDemoSelect(cardSet: CardSet) {
    setText(cardSet.sourceText);
    setLanguage(cardSet.language);
    onDemoSelect(cardSet);
  }

  return (
    <form
      className="rounded-3xl border-border bg-surface overflow-hidden border shadow-sm"
      onSubmit={handleSubmit}
    >
      <div className="border-border-soft flex flex-wrap items-center justify-between gap-3 border-b px-5 py-4">
        <div className="flex items-center gap-2.5">
          <label htmlFor={languageId} className="text-sm font-bold">
            어떤 언어의 글인가요?
          </label>
          <Select
            ref={languageRef}
            id={languageId}
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </div>
        <DemoArticlePicker onSelect={handleDemoSelect} />
      </div>

      <div className="px-5 pt-5">
        <label htmlFor={textId} className="sr-only">
          외국어 글
        </label>
        <Textarea
          ref={textRef}
          id={textId}
          rows={7}
          value={text}
          placeholder="외국어 글이나 문장을 붙여넣어 주세요"
          aria-invalid={isTooLong}
          aria-describedby={`${lengthId} ${privacyId}`}
          onChange={(event) => setText(event.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 px-5 pt-3.5 pb-5">
        <p id={privacyId} className="text-text-muted flex items-center gap-1.5 text-sm">
          <LockIcon className="size-4" />
          AI가 처리해요. 개인정보가 담긴 글은 넣지 말아 주세요
        </p>
        <div className="ml-auto flex items-center gap-3.5">
          <p
            id={lengthId}
            className={cn("text-sm tabular-nums", isTooLong ? "text-danger" : "text-text-muted")}
          >
            {isTooLong && `${ERROR_DETAILS.TEXT_TOO_LONG.message} · `}
            {textLength.toLocaleString("ko-KR")} / {MAX_TEXT_LENGTH.toLocaleString("ko-KR")}자
          </p>
          <Button type="submit" disabled={!canSubmit}>
            <SparkleIcon className="size-4.5" />
            단어 싹싹 담기
          </Button>
        </div>
      </div>
    </form>
  );
}
