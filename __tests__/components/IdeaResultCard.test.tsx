import { render, screen } from "@testing-library/react-native";
import { IdeaResultCard } from "../../components/chat/IdeaResultCard";
import { useCategoryStore } from "../../store/useCategoryStore";
import type { Category, Note } from "../../types";

jest.mock("../../store/useCategoryStore");

const mockCategory: Category = {
  id: "cat-1", userId: "u", name: "초안", color: "#F59E0B", icon: "💡",
  isDefault: true, sortOrder: 0, createdAt: new Date(),
};

const mockNote: Note = {
  id: "n1", userId: "u", rawContent: "링키 앱 아이디어",
  summary: "링키 앱 아이디어 요약",
  contentType: "idea", tags: ["앱", "AI"], title: "링키 앱 아이디어",
  categoryId: "cat-1", derivedIdeas: [
    { context: "c", target: "t", expectedTitle: "e" },
  ],
  titleOptions: [
    { formula: "공식A", title: "제목1" },
    { formula: "공식B", title: "제목2" },
  ],
  scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
};

describe("IdeaResultCard", () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      getCategoryById: (id: string | null) => id === "cat-1" ? mockCategory : null,
    });
  });

  it("저장 완료 헤더 렌더", () => {
    render(<IdeaResultCard note={mockNote} />);
    expect(screen.getByText(/저장됐어요/)).toBeTruthy();
  });

  it("요약 렌더", () => {
    render(<IdeaResultCard note={mockNote} />);
    expect(screen.getByText("링키 앱 아이디어 요약")).toBeTruthy();
  });

  it("태그 렌더", () => {
    render(<IdeaResultCard note={mockNote} />);
    expect(screen.getByText("#앱")).toBeTruthy();
    expect(screen.getByText("#AI")).toBeTruthy();
  });

  it("제목 공식·파생 아이디어 개수 렌더", () => {
    render(<IdeaResultCard note={mockNote} />);
    expect(screen.getByText(/제목 공식 2개/)).toBeTruthy();
    expect(screen.getByText(/파생 아이디어 1개/)).toBeTruthy();
  });

  it("titleOptions 없을 때 개수 섹션 미표시", () => {
    render(<IdeaResultCard note={{ ...mockNote, titleOptions: [], derivedIdeas: [] }} />);
    expect(screen.queryByText(/제목 공식/)).toBeNull();
  });
});
