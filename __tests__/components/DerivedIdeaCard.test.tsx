import { fireEvent, render, screen } from "@testing-library/react-native";
import { DerivedIdeaCard } from "../../components/chat/DerivedIdeaCard";
import type { DerivedIdea } from "../../types";

const mockIdeas: DerivedIdea[] = [
  { context: "트렌드 맥락1", target: "타겟1", expectedTitle: "예상 제목1" },
  { context: "트렌드 맥락2", target: "타겟2", expectedTitle: "예상 제목2" },
  { context: "트렌드 맥락3", target: "타겟3", expectedTitle: "예상 제목3" },
];

const baseProps = {
  ideas: mockIdeas,
  noteId: "note-1",
  onSave: jest.fn(),
  onDrillDown: jest.fn(),
  drillDownResults: {},
  drillingDownKeys: [],
};

describe("DerivedIdeaCard", () => {
  it("3개 파생 아이디어 렌더", () => {
    render(<DerivedIdeaCard {...baseProps} />);
    expect(screen.getByTestId("derived-idea-0")).toBeTruthy();
    expect(screen.getByTestId("derived-idea-1")).toBeTruthy();
    expect(screen.getByTestId("derived-idea-2")).toBeTruthy();
  });

  it("맥락·타겟·제목 표시", () => {
    render(<DerivedIdeaCard {...baseProps} />);
    expect(screen.getByText("트렌드 맥락1")).toBeTruthy();
    expect(screen.getByText("타겟1")).toBeTruthy();
    expect(screen.getByText("예상 제목1")).toBeTruthy();
  });

  it("저장 버튼 → onSave 호출", () => {
    const onSave = jest.fn();
    render(<DerivedIdeaCard {...baseProps} onSave={onSave} />);
    fireEvent.press(screen.getByLabelText("파생 아이디어 1 저장"));
    expect(onSave).toHaveBeenCalledWith(mockIdeas[0]);
  });

  it("더 파고들기 버튼 → onDrillDown 호출", () => {
    const onDrillDown = jest.fn();
    render(<DerivedIdeaCard {...baseProps} onDrillDown={onDrillDown} />);
    fireEvent.press(screen.getByLabelText("아이디어 1 더 파고들기"));
    expect(onDrillDown).toHaveBeenCalledWith(0);
  });
});
