import { fireEvent, render, screen } from "@testing-library/react-native";
import { InputBar } from "../../components/chat/InputBar";

describe("InputBar", () => {
  it("입력창과 전송 버튼 렌더", () => {
    render(<InputBar onOpen={jest.fn()} />);
    expect(screen.getByTestId("quick-input")).toBeTruthy();
    expect(screen.getByLabelText("전송")).toBeTruthy();
  });

  it("노트 모드 버튼 탭 → onOpen 콜백 호출", () => {
    const onOpen = jest.fn();
    render(<InputBar onOpen={onOpen} />);
    fireEvent.press(screen.getByLabelText("노트 모드 열기"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("텍스트 입력 후 전송 → onSend 콜백 호출", () => {
    const onSend = jest.fn();
    render(<InputBar onOpen={jest.fn()} onSend={onSend} />);
    fireEvent.changeText(screen.getByTestId("quick-input"), "테스트 아이디어");
    fireEvent.press(screen.getByLabelText("전송"));
    expect(onSend).toHaveBeenCalledWith("테스트 아이디어");
  });
});
