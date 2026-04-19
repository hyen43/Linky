import { fireEvent, render, screen } from "@testing-library/react-native";
import { InputBar } from "../../components/chat/InputBar";

describe("InputBar", () => {
  it("입력창과 버튼 렌더", () => {
    render(<InputBar onOpen={jest.fn()} onMicPress={jest.fn()} isRecording={false} />);
    expect(screen.getByLabelText("아이디어 입력")).toBeTruthy();
    expect(screen.getByLabelText("마이크 버튼")).toBeTruthy();
  });

  it("입력창 탭 → onOpen 콜백 호출", () => {
    const onOpen = jest.fn();
    render(<InputBar onOpen={onOpen} onMicPress={jest.fn()} isRecording={false} />);
    fireEvent.press(screen.getByLabelText("아이디어 입력"));
    expect(onOpen).toHaveBeenCalledTimes(1);
  });

  it("마이크 버튼 press → onMicPress 콜백", () => {
    const onMicPress = jest.fn();
    render(<InputBar onOpen={jest.fn()} onMicPress={onMicPress} isRecording={false} />);
    fireEvent.press(screen.getByLabelText("마이크 버튼"));
    expect(onMicPress).toHaveBeenCalledTimes(1);
  });
});
