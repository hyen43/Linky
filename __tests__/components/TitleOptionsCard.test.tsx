import { fireEvent, render, screen } from "@testing-library/react-native";
import { TitleOptionsCard } from "../../components/chat/TitleOptionsCard";
import type { TitleOption } from "../../types";

const mockOptions: TitleOption[] = [
  { formula: "숫자+행동+결과", title: "30일 도전 결과" },
  { formula: "역발상",         title: "하지 말라고? 해봤더니" },
  { formula: "타겟호명",       title: "관심 있다면 꼭 보세요" },
];

describe("TitleOptionsCard", () => {
  it("3개 제목 옵션 렌더", () => {
    render(<TitleOptionsCard options={mockOptions} onCopy={jest.fn()} />);
    expect(screen.getByTestId("title-option-0")).toBeTruthy();
    expect(screen.getByTestId("title-option-1")).toBeTruthy();
    expect(screen.getByTestId("title-option-2")).toBeTruthy();
  });

  it("공식명과 제목 표시", () => {
    render(<TitleOptionsCard options={mockOptions} onCopy={jest.fn()} />);
    expect(screen.getByText("[숫자+행동+결과]")).toBeTruthy();
    expect(screen.getByText("30일 도전 결과")).toBeTruthy();
  });

  it("복사 버튼 → onCopy 호출", () => {
    const onCopy = jest.fn();
    render(<TitleOptionsCard options={mockOptions} onCopy={onCopy} />);
    fireEvent.press(screen.getByLabelText("제목 복사: 30일 도전 결과"));
    expect(onCopy).toHaveBeenCalledWith("30일 도전 결과");
  });
});
