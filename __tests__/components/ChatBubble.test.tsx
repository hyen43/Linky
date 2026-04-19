import { render, screen } from "@testing-library/react-native";
import { ChatBubble } from "../../components/chat/ChatBubble";
import type { ChatMessage } from "../../types";

const baseMsg: ChatMessage = {
  id: "1",
  role: "ai",
  content: "테스트 메시지",
  createdAt: new Date(),
};

describe("ChatBubble", () => {
  it("사용자 메시지: 텍스트 렌더", () => {
    render(<ChatBubble message={{ ...baseMsg, role: "user" }} />);
    expect(screen.getByText("테스트 메시지")).toBeTruthy();
  });

  it("AI 메시지: 텍스트 렌더", () => {
    render(<ChatBubble message={{ ...baseMsg, role: "ai" }} />);
    expect(screen.getByText("테스트 메시지")).toBeTruthy();
  });

  it("사용자 메시지: bg-primary 클래스 적용", () => {
    const { toJSON } = render(<ChatBubble message={{ ...baseMsg, role: "user" }} />);
    expect(JSON.stringify(toJSON())).toContain("bg-primary");
  });
});
