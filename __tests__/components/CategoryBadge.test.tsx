import { render, screen } from "@testing-library/react-native";
import { CategoryBadge } from "../../components/ui/CategoryBadge";
import type { Category } from "../../types";

const mockCat: Category = {
  id: "cat-1", userId: "u1", name: "초안", color: "#F59E0B",
  icon: "💡", isDefault: true, sortOrder: 0, createdAt: new Date(),
};

describe("CategoryBadge", () => {
  it("이름과 아이콘 렌더", () => {
    render(<CategoryBadge category={mockCat} />);
    expect(screen.getByText("초안")).toBeTruthy();
    expect(screen.getByText("💡")).toBeTruthy();
  });

  it("testID 접근 가능", () => {
    render(<CategoryBadge category={mockCat} />);
    expect(screen.getByTestId("category-badge-cat-1")).toBeTruthy();
  });

  it("sm 사이즈 렌더 (크래시 없음)", () => {
    const { toJSON } = render(<CategoryBadge category={mockCat} size="sm" />);
    expect(toJSON()).toBeTruthy();
  });
});
