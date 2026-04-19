import { render, screen } from "@testing-library/react-native";
import CaptureScreen from "../app/(tabs)/index";
import { useChatStore } from "../store/useChatStore";
import { useCategoryStore } from "../store/useCategoryStore";
import type { Category } from "../types";

jest.mock("../store/useChatStore");
jest.mock("../store/useCategoryStore");

const mockCategories: Category[] = [
  { id: "cat-1", userId: "u", name: "초안", color: "#F59E0B", icon: "💡", isDefault: true, sortOrder: 0, createdAt: new Date() },
];

describe("CaptureScreen (메인 화면)", () => {
  beforeEach(() => {
    (useChatStore as unknown as jest.Mock).mockReturnValue({
      messages: [{ id: "welcome", role: "ai", content: "안녕하세요! 링키예요 👋", createdAt: new Date(0) }],
      notes: [],
      isTyping: false,
      isRecording: false,
      sendMessage: jest.fn(),
      toggleRecording: jest.fn(),
    });
    (useCategoryStore as unknown as jest.Mock).mockReturnValue({
      categories: mockCategories,
      getCategoryById: () => mockCategories[0],
    });
  });

  it("헤더 렌더", () => {
    render(<CaptureScreen />);
    expect(screen.getByText("링키 🔗")).toBeTruthy();
  });

  it("웰컴 메시지 렌더", () => {
    render(<CaptureScreen />);
    expect(screen.getByText(/안녕하세요! 링키예요/)).toBeTruthy();
  });

  it("InputBar 렌더", () => {
    render(<CaptureScreen />);
    expect(screen.getByLabelText("마이크 버튼")).toBeTruthy();
    expect(screen.getByLabelText("전송 버튼")).toBeTruthy();
  });
});
