import { cn } from "@/lib/cn";

describe("cn", () => {
  it("클래스 이름을 공백으로 이어 붙인다", () => {
    expect(cn("card", "flipped")).toBe("card flipped");
  });

  it("거짓인 값은 제외한다", () => {
    expect(cn("card", false, null, undefined, "")).toBe("card");
  });

  it("남는 클래스가 없으면 빈 문자열을 반환한다", () => {
    expect(cn(false, undefined)).toBe("");
  });
});
