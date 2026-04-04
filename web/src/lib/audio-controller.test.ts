import { globalAudioController } from "./audio-controller"

describe("AudioController", () => {
  let audio1: HTMLAudioElement;
  let audio2: HTMLAudioElement;

  beforeEach(() => {
    // Reset global state
    const active = globalAudioController.getActiveAudio();
    if (active) {
      globalAudioController.clear(active);
    }

    audio1 = document.createElement("audio");
    audio2 = document.createElement("audio");

    // Mock play and pause
    audio1.play = jest.fn().mockResolvedValue(undefined);
    audio1.pause = jest.fn();
    audio2.play = jest.fn().mockResolvedValue(undefined);
    audio2.pause = jest.fn();
  });

  it("should play audio and call state callback", async () => {
    const callback = jest.fn();
    await globalAudioController.play(audio1, callback);

    expect(audio1.play).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(true);
    expect(globalAudioController.getActiveAudio()).toBe(audio1);
  });

  it("should pause previously playing audio when a new one is played", async () => {
    const callback1 = jest.fn();
    const callback2 = jest.fn();

    await globalAudioController.play(audio1, callback1);
    expect(globalAudioController.getActiveAudio()).toBe(audio1);

    await globalAudioController.play(audio2, callback2);

    expect(audio1.pause).toHaveBeenCalled();
    expect(callback1).toHaveBeenCalledWith(false);
    expect(audio2.play).toHaveBeenCalled();
    expect(callback2).toHaveBeenCalledWith(true);
    expect(globalAudioController.getActiveAudio()).toBe(audio2);
  });

  it("should pause current audio", async () => {
    const callback = jest.fn();
    await globalAudioController.play(audio1, callback);

    globalAudioController.pause(audio1);

    expect(audio1.pause).toHaveBeenCalled();
    expect(callback).toHaveBeenCalledWith(false);
  });

  it("should clear state when clear is called for active audio", async () => {
    const callback = jest.fn();
    await globalAudioController.play(audio1, callback);

    globalAudioController.clear(audio1);

    expect(globalAudioController.getActiveAudio()).toBeNull();
  });

  it("should not clear state if clear is called for inactive audio", async () => {
    const callback = jest.fn();
    await globalAudioController.play(audio1, callback);

    globalAudioController.clear(audio2);

    expect(globalAudioController.getActiveAudio()).toBe(audio1);
  });

  it("should handle play error and update state callback", async () => {
    const error = new Error("Play failed");
    audio1.play = jest.fn().mockRejectedValue(error);

    const callback = jest.fn();

    await expect(globalAudioController.play(audio1, callback)).rejects.toThrow(error);
    expect(callback).toHaveBeenCalledWith(false);
  });
});
