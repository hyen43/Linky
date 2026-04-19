import { act, renderHook } from "@testing-library/react-native";
import { useCategoryStore } from "../../store/useCategoryStore";

describe("useCategoryStore", () => {
  beforeEach(() => {
    // 스토어 초기화: 각 테스트마다 새 인스턴스 필요
    useCategoryStore.setState({
      categories: [
        { id: "cat-1", userId: "u", name: "초안",   color: "#F59E0B", icon: "💡", isDefault: true,  sortOrder: 0, createdAt: new Date() },
        { id: "cat-2", userId: "u", name: "보관함", color: "#3B82F6", icon: "📦", isDefault: true,  sortOrder: 1, createdAt: new Date() },
        { id: "cat-3", userId: "u", name: "완료",   color: "#43E97B", icon: "✅", isDefault: true,  sortOrder: 2, createdAt: new Date() },
      ],
    });
  });

  it("초기 카테고리 로드", () => {
    const { result } = renderHook(() => useCategoryStore());
    expect(result.current.categories).toHaveLength(3);
  });

  it("카테고리 추가", () => {
    const { result } = renderHook(() => useCategoryStore());
    act(() => {
      result.current.addCategory({ name: "유튜브 브이로그", color: "#EC4899", icon: "🎥" });
    });
    expect(result.current.categories).toHaveLength(4);
    expect(result.current.categories.at(-1)?.name).toBe("유튜브 브이로그");
    expect(result.current.categories.at(-1)?.isDefault).toBe(false);
  });

  it("카테고리 수정", () => {
    const { result } = renderHook(() => useCategoryStore());
    act(() => {
      result.current.updateCategory("cat-1", { name: "아이디어 초안" });
    });
    expect(result.current.categories.find((c) => c.id === "cat-1")?.name).toBe("아이디어 초안");
  });

  it("카테고리 삭제", () => {
    const { result } = renderHook(() => useCategoryStore());
    act(() => {
      result.current.deleteCategory("cat-3");
    });
    expect(result.current.categories).toHaveLength(2);
    expect(result.current.categories.find((c) => c.id === "cat-3")).toBeUndefined();
  });

  it("getCategoryById — 존재하는 id", () => {
    const { result } = renderHook(() => useCategoryStore());
    const cat = result.current.getCategoryById("cat-1");
    expect(cat?.name).toBe("초안");
  });

  it("getCategoryById — null 반환 (없는 id)", () => {
    const { result } = renderHook(() => useCategoryStore());
    expect(result.current.getCategoryById("nonexistent")).toBeNull();
    expect(result.current.getCategoryById(null)).toBeNull();
  });
});
