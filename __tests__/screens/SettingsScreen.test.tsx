import { fireEvent, render, screen } from "@testing-library/react-native";
import SettingsScreen from "../../app/(tabs)/settings";
import { useCategoryStore } from "../../store/useCategoryStore";
import type { Category } from "../../types";

jest.mock("../../store/useCategoryStore");

const mockCategories: Category[] = [
  { id: "c1", userId: "u", name: "초안",   color: "#F59E0B", icon: "💡", isDefault: true,  sortOrder: 0, createdAt: new Date() },
  { id: "c2", userId: "u", name: "내 폴더", color: "#6C63FF", icon: "📝", isDefault: false, sortOrder: 1, createdAt: new Date() },
];

const mockAddCategory = jest.fn();
const mockDeleteCategory = jest.fn();

describe("SettingsScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      addCategory: mockAddCategory,
      updateCategory: jest.fn(),
      deleteCategory: mockDeleteCategory,
    });
  });

  it("헤더 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByText("설정 ⚙️")).toBeTruthy();
  });

  it("카테고리 목록 렌더", () => {
    render(<SettingsScreen />);
    expect(screen.getByTestId("settings-cat-c1")).toBeTruthy();
    expect(screen.getByTestId("settings-cat-c2")).toBeTruthy();
  });

  it("기본 카테고리에 삭제 버튼 없음", () => {
    render(<SettingsScreen />);
    expect(screen.queryByLabelText("초안 삭제")).toBeNull();
  });

  it("커스텀 카테고리에 삭제 버튼 있음", () => {
    render(<SettingsScreen />);
    expect(screen.getByLabelText("내 폴더 삭제")).toBeTruthy();
  });

  it("카테고리 추가 버튼 → 입력 폼 표시", () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId("add-category-btn"));
    expect(screen.getByTestId("new-category-input")).toBeTruthy();
  });

  it("이름 입력 후 추가 버튼 → addCategory 호출", () => {
    render(<SettingsScreen />);
    fireEvent.press(screen.getByTestId("add-category-btn"));
    fireEvent.changeText(screen.getByTestId("new-category-input"), "새 카테고리");
    fireEvent.press(screen.getByTestId("add-category-confirm"));
    expect(mockAddCategory).toHaveBeenCalledWith(
      expect.objectContaining({ name: "새 카테고리" })
    );
  });
});
