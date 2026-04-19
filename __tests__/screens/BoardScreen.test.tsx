import { fireEvent, render, screen } from "@testing-library/react-native";
import BoardScreen from "../../app/(tabs)/board";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import type { Category, Note } from "../../types";

jest.mock("../../store/useCategoryStore");
jest.mock("../../store/useChatStore");

const mockCategories: Category[] = [
  { id: "cat-1", userId: "u", name: "초안",   color: "#F59E0B", icon: "💡", isDefault: true, sortOrder: 0, createdAt: new Date() },
  { id: "cat-2", userId: "u", name: "보관함", color: "#3B82F6", icon: "📦", isDefault: true, sortOrder: 1, createdAt: new Date() },
];

const mockNotes: Note[] = [
  {
    id: "n1", userId: "u", rawContent: "브이로그 아이디어", summary: "브이로그",
    contentType: "idea", tags: ["브이로그"], title: "브이로그 아이디어",
    categoryId: "cat-1", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "n2", userId: "u", rawContent: "나중에 쓸 글감", summary: "글감",
    contentType: "idea", tags: ["글쓰기"], title: "나중에 쓸 글감",
    categoryId: "cat-2", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
];

describe("BoardScreen", () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      getCategoryById: (id: string | null) => mockCategories.find((c) => c.id === id) ?? null,
    });
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: mockNotes });
  });

  it("헤더 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByText("보드 📋")).toBeTruthy();
  });

  it("카테고리 탭 렌더", () => {
    render(<BoardScreen />);
    expect(screen.getByTestId("category-tabs")).toBeTruthy();
    expect(screen.getByTestId("category-tab-cat-1")).toBeTruthy();
    expect(screen.getByTestId("category-tab-cat-2")).toBeTruthy();
  });

  it("카테고리 탭 선택 시 해당 노트 표시", () => {
    render(<BoardScreen />);
    fireEvent.press(screen.getByTestId("category-tab-cat-1"));
    expect(screen.getByTestId("note-card-n1")).toBeTruthy();
  });

  it("노트 없는 카테고리 - 빈 상태 메시지", () => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: [] });
    render(<BoardScreen />);
    expect(screen.getByText(/아이디어가 없어요/)).toBeTruthy();
  });
});
