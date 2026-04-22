import { render, screen } from "@testing-library/react-native";
import SettingsScreen from "../../app/(tabs)/settings";
import { useCategoryStore } from "../../store/useCategoryStore";
import { useChatStore } from "../../store/useChatStore";
import type { Category, Note } from "../../types";

jest.mock("../../store/useCategoryStore");
jest.mock("../../store/useChatStore");
jest.mock("expo-linear-gradient", () => ({
  LinearGradient: ({ children }: { children: React.ReactNode }) => children,
}));

const mockCategories: Category[] = [
  { id: "c1", userId: "u", name: "초안",   color: "#9CA3AF", icon: "📄", isDefault: true,  sortOrder: 0, createdAt: new Date() },
  { id: "c2", userId: "u", name: "제작중", color: "#F59E0B", icon: "✏️", isDefault: true,  sortOrder: 1, createdAt: new Date() },
  { id: "c3", userId: "u", name: "완료",   color: "#22C55E", icon: "✅", isDefault: true,  sortOrder: 2, createdAt: new Date() },
];

const mockNotes: Note[] = [
  {
    id: "n1", userId: "u", rawContent: "아이디어", summary: "요약",
    contentType: "idea", tags: [], title: "아이디어",
    categoryId: "c1", derivedIdeas: [], titleOptions: [],
    scheduledAt: null, createdAt: new Date(), updatedAt: new Date(),
  },
];

describe("MyPage (마이페이지)", () => {
  beforeEach(() => {
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
    });
    (useChatStore as unknown as jest.Mock).mockReturnValue({ notes: mockNotes });
  });

  it("마이페이지 헤더 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("마이페이지")).toBeTruthy();
  });

  it("프로필 카드 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("크리에이터 김")).toBeTruthy();
  });

  it("통계 카드 렌더 (초안/제작중/완료)", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("초안")).toBeTruthy();
    expect(screen.getByText("제작중")).toBeTruthy();
    expect(screen.getByText("완료")).toBeTruthy();
  });

  it("설정 목록 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("알림 설정")).toBeTruthy();
    expect(screen.getByText("채찍질 강도")).toBeTruthy();
  });

  it("7일 리포트 카드 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("⭐ 7일간 진행률 리포트")).toBeTruthy();
  });
});
