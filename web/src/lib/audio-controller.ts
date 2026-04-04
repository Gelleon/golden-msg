export type StateChangeCallback = (isPlaying: boolean) => void;

class AudioController {
  private activeAudio: HTMLMediaElement | null = null;
  private activeCallback: StateChangeCallback | null = null;

  /**
   * Воспроизводит аудио, останавливая предыдущее, если оно было
   */
  async play(audio: HTMLMediaElement, onStateChange: StateChangeCallback) {
    if (this.activeAudio && this.activeAudio !== audio) {
      this.activeAudio.pause();
      if (this.activeCallback) {
        this.activeCallback(false);
      }
    }
    
    this.activeAudio = audio;
    this.activeCallback = onStateChange;
    
    try {
      await audio.play();
      onStateChange(true);
    } catch (error) {
      console.error("AudioController play failed:", error);
      onStateChange(false);
      throw error;
    }
  }

  /**
   * Ставит на паузу переданное аудио
   */
  pause(audio: HTMLMediaElement) {
    audio.pause();
    if (this.activeAudio === audio) {
      if (this.activeCallback) {
        this.activeCallback(false);
      }
    }
  }

  /**
   * Очищает состояние, если переданное аудио было активно
   */
  clear(audio: HTMLMediaElement) {
    if (this.activeAudio === audio) {
      this.activeAudio = null;
      this.activeCallback = null;
    }
  }

  /**
   * Возвращает текущее активное аудио
   */
  getActiveAudio(): HTMLMediaElement | null {
    return this.activeAudio;
  }
}

export const globalAudioController = new AudioController();
