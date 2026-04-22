import { fireEvent, render, screen } from "@testing-library/react-native";
import BoardScreen from "../../app/(tabs)/board";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import type { Category, Note } from "../../types";

jest.mock("../../store/useCategoryStore");
jest.mock("../../store/useChatStore");

const mockCategories: Category[] = [
  { id: "cat-1", userId: "u", name: "초안",   color: "#9CA3AF", icon: "📄", isDefault: true, sortOrder: 0, createdAt: new Date() },
  { id: "cat-2", userId: "u", name: "제작중", color: "#F59E0B", icon: "✏️", isDefault: true, sortOrder: 1, createdAt: new Date() },
  { id: "cat-3", userId: "u", name: "완료",   color: "#22C55E", icon: "✅", isDefault: true, sortOrder: 2, createdAt: new Date() },
];

const mockNotes: Note[] = [
  {
    id: "n1", userId: "u", rawContent: "브이로그 아이디어", summary: "브이로그",
    contentType: "idea", tags: ["브이로그"], title: "브이로그 아이디어",
    categoryId: "cat-1", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
];

describe("BoardScreen (탐색)", () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      getCategoryById: (id: string | null) => mockCategories.find((c) => c.id === id) ?? null,
    });
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: mockNotes });
  });

  it("탐색 헤더 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByText("탐색")).toBeTruthy();
  });

  it("기본 폴더 섹션 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByText("기본 폴더")).toBeTruthy();
    expect(screen.getByText("초안")).toBeTruthy();
    expect(screen.getByText("제작중")).toBeTruthy();
    expect(screen.getByText("완료")).toBeTruthy();
  });

  it("검색 입력창 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByTestId("search-input")).toBeTruthy();
  });

  it("최근 메모 섹션에 노트 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByText("최근 메모")).toBeTruthy();
    expect(screen.getAllByText("브이로그 아이디어").length).toBeGreaterThan(0);
  });

  it("검색어 입력 시 필터링", () => {
    render(<BoardScreen />);
    fireEvent.changeText(screen.getByTestId("search-input"), "없는키워드xyz");
    expect(screen.queryByText("브이로그 아이디어")).toBeNull();
  });

  it("새 폴더 추가 버튼 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByTestId("add-folder-btn")).toBeTruthy();
  });
});
