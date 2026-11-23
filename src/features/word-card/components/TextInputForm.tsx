"use client";

import { useState } from "react";
import type { SubmitEvent } from "react";

import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";
import { Textarea } from "@/components/ui/Textarea";
import { MAX_TEXT_LENGTH, SUPPORTED_LANGUAGES } from "@/features/word-card/constants";
import { ERROR_DETAILS } from "@/lib/ai/errors";
import type { GenerateCardsInput } from "@/lib/ai/types";
import { cn } from "@/lib/cn";

type TextInputFormProps = {
  isLoading: boolean;
  onSubmit: (input: GenerateCardsInput) => void;
};

export function TextInputForm({ isLoading, onSubmit }: TextInputFormProps) {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState<string>(SUPPORTED_LANGUAGES[0]);

  // 서버가 앞뒤 공백을 뺀 길이로 판단하므로 같은 기준으로 센다
  const textLength = text.trim().length;
  const isTooLong = textLength > MAX_TEXT_LENGTH;
  const canSubmit = textLength > 0 && !isTooLong && !isLoading;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (canSubmit) onSubmit({ text: text.trim(), language });
  }

  return (
    <form className="flex flex-col gap-3" onSubmit={handleSubmit}>
      <label htmlFor="source-text" className="font-bold">
        외국어 글
      </label>
      <Textarea
        id="source-text"
        rows={8}
        value={text}
        placeholder="외국어 글이나 문장을 붙여넣어 주세요"
        aria-invalid={isTooLong}
        aria-describedby="source-text-length"
        onChange={(event) => setText(event.target.value)}
      />
      <p
        id="source-text-length"
        className={cn("text-right text-sm", isTooLong ? "text-danger" : "text-text-muted")}
      >
        {isTooLong && `${ERROR_DETAILS.TEXT_TOO_LONG.message} · `}
        {textLength.toLocaleString("ko-KR")} / {MAX_TEXT_LENGTH.toLocaleString("ko-KR")}자
      </p>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <label className="flex items-center gap-3">
          <span className="text-sm">언어</span>
          <Select
            className="grow"
            value={language}
            onChange={(event) => setLanguage(event.target.value)}
          >
            {SUPPORTED_LANGUAGES.map((name) => (
              <option key={name} value={name}>
                {name}
              </option>
            ))}
          </Select>
        </label>
        <Button type="submit" disabled={!canSubmit}>
          단어 싹싹 담기
        </Button>
      </div>
    </form>
  );
}
