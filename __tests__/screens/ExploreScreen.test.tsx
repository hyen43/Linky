import { fireEvent, render, screen } from "@testing-library/react-native";
import SearchScreen from "../../app/(tabs)/search";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import type { Category, Note } from "../../types";

jest.mock("../../store/useCategoryStore");
jest.mock("../../store/useChatStore");

const mockCategories: Category[] = [
  { id: "cat-1", userId: "u", name: "초안", color: "#F59E0B", icon: "💡", isDefault: true, sortOrder: 0, createdAt: new Date() },
];

const mockNotes: Note[] = [
  {
    id: "n1", userId: "u", rawContent: "유튜브 아이디어", summary: "유튜브",
    contentType: "idea", tags: ["유튜브"], title: "유튜브 아이디어",
    categoryId: "cat-1", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
  {
    id: "n2", userId: "u", rawContent: "마케팅 전략", summary: "마케팅",
    contentType: "idea", tags: ["마케팅"], title: "마케팅 전략",
    categoryId: "cat-1", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
];

describe("SearchScreen", () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      getCategoryById: (id: string | null) => mockCategories.find((c) => c.id === id) ?? null,
    });
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: mockNotes });
  });

  it("헤더 렌더", () => {
    render(<SearchScreen />);
    expect(screen.getByText("검색")).toBeTruthy();
  });

  it("검색어 입력 시 필터링", () => {
    render(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId("search-input"), "마케팅");
    expect(screen.queryByText("유튜브 아이디어")).toBeNull();
    expect(screen.getByText("마케팅 전략")).toBeTruthy();
  });

  it("노트 없을 때 빈 상태 메시지", () => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: [] });
    render(<SearchScreen />);
    expect(screen.getByText("저장된 아이디어가 없어요")).toBeTruthy();
  });

  it("검색 결과 없을 때 안내 메시지", () => {
    render(<SearchScreen />);
    fireEvent.changeText(screen.getByTestId("search-input"), "없는키워드xyz");
    expect(screen.getByText("검색 결과가 없어요")).toBeTruthy();
  });
});
