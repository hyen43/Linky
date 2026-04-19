import { fireEvent, render, screen } from "@testing-library/react-native";
import { MemoCard } from "../../components/memo/MemoCard";
import type { Note } from "../../types";

const mockIdea: Note = {
  id: "idea-1",
  userId: "u",
  rawContent: "테스트 메모 내용",
  summary: "테스트 요약",
  contentType: "idea",
  title: "[26.04] 테스트 메모",
  tags: ["테스트", "UI"],
  categoryId: null,
  derivedIdeas: [],
  titleOptions: [],
  scheduledAt: null,
  createdAt: new Date("2026-04-16"),
  updatedAt: new Date("2026-04-16"),
};

describe("MemoCard", () => {
  it("제목, 태그, 요약 렌더", () => {
    render(<MemoCard idea={mockIdea} />);
    expect(screen.getByText(/테스트 메모/)).toBeTruthy();
    expect(screen.getByText("#테스트")).toBeTruthy();
    expect(screen.getByText("#UI")).toBeTruthy();
    expect(screen.getByText(/테스트 요약/)).toBeTruthy();
  });

  it("onPress 콜백 호출", () => {
    const onPress = jest.fn();
    render(<MemoCard idea={mockIdea} onPress={onPress} />);
    fireEvent.press(screen.getByLabelText(`메모: ${mockIdea.title}`));
    expect(onPress).toHaveBeenCalledTimes(1);
  });

  it("testID로 접근 가능", () => {
    render(<MemoCard idea={mockIdea} />);
    expect(screen.getByTestId("memo-card-idea-1")).toBeTruthy();
  });
});
