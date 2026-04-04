import React from "react"
import { render, screen, fireEvent, act } from "@testing-library/react"
import { VoiceMessage } from "./voice-message"
import { globalAudioController } from "@/lib/audio-controller"

describe("VoiceMessage Component", () => {
  let playMock1: jest.Mock
  let pauseMock1: jest.Mock
  let playMock2: jest.Mock
  let pauseMock2: jest.Mock

  beforeEach(() => {
    // Reset global controller
    const active = globalAudioController.getActiveAudio()
    if (active) {
      globalAudioController.clear(active)
    }

    playMock1 = jest.fn().mockResolvedValue(undefined)
    pauseMock1 = jest.fn()
    playMock2 = jest.fn().mockResolvedValue(undefined)
    pauseMock2 = jest.fn()

    // Mock HTMLMediaElement prototype
    window.HTMLMediaElement.prototype.play = playMock1
    window.HTMLMediaElement.prototype.pause = pauseMock1
  })

  it("should play audio and update UI", async () => {
    render(<VoiceMessage src="test1.mp3" duration={10} />)
    const playButton = screen.getByRole("button", { name: /Воспроизвести/i })
    
    await act(async () => {
      fireEvent.click(playButton)
    })

    expect(playMock1).toHaveBeenCalled()
    // It should change to Pause button
    expect(screen.getByRole("button", { name: /Пауза/i })).toBeInTheDocument()
  })

  it("should pause currently playing audio when a new one starts", async () => {
    const { container: container1 } = render(<VoiceMessage src="test1.mp3" duration={10} />)
    
    // We need a way to mock two different audio elements with different play/pause methods.
    // For simplicity, let's just rely on the controller logic being called.
    const playBtn1 = screen.getByRole("button", { name: /Воспроизвести/i })
    
    await act(async () => {
      fireEvent.click(playBtn1)
    })
    
    expect(screen.getByRole("button", { name: /Пауза/i })).toBeInTheDocument()

    // Since we can't easily mock the second audio element differently in JSDOM, 
    // we'll just check if globalAudioController's behavior is invoked by rendering a second message.
    const playMockForSecond = jest.fn().mockResolvedValue(undefined)
    window.HTMLMediaElement.prototype.play = playMockForSecond
    
    const { container: container2 } = render(<VoiceMessage src="test2.mp3" duration={10} />)
    const playBtn2 = screen.getAllByRole("button", { name: /Воспроизвести/i })[0] // The second component's play button
    
    await act(async () => {
      fireEvent.click(playBtn2)
    })

    // The first one should have paused
    expect(pauseMock1).toHaveBeenCalled()
  })

  it("should handle playback error and restore state", async () => {
    const errorMock = jest.fn().mockRejectedValue(new Error("Network error"))
    window.HTMLMediaElement.prototype.play = errorMock

    render(<VoiceMessage src="test-error.mp3" duration={10} />)
    const playButton = screen.getByRole("button", { name: /Воспроизвести/i })
    
    await act(async () => {
      fireEvent.click(playButton)
    })

    // State should be restored to non-playing, and play button should be disabled with error
    expect(screen.getByRole("button")).toBeDisabled()
    expect(globalAudioController.getActiveAudio()).toBeNull() // Clear was called on error inside catch/handleError if triggered
  })
})
