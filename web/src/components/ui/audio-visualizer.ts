export class AudioVisualizer {
  container: HTMLElement;
  audioUrl: string;
  audioContext: AudioContext | null = null;
  analyser: AnalyserNode | null = null;
  sourceNode: MediaElementAudioSourceNode | null = null;
  audioElement: HTMLAudioElement;
  
  bars: HTMLElement[] = [];
  numBars = 30;
  
  isPlaying = false;
  isLoaded = false;
  animationId: number | null = null;
  
  playBtn!: HTMLElement;
  progressTrack!: HTMLElement;
  progressFill!: HTMLElement;
  timeDisplay!: HTMLElement;
  waveContainer!: HTMLElement;
  errorDisplay!: HTMLElement;
  loadingDisplay!: HTMLElement;
  volumeTrack!: HTMLElement;
  volumeFill!: HTMLElement;

  private handlers: { [key: string]: (e: any) => void } = {};

  constructor(container: HTMLElement, audioUrl: string) {
    this.container = container;
    this.audioUrl = audioUrl;

    // Create Audio Element
    this.audioElement = new Audio();
    this.audioElement.crossOrigin = "anonymous";
    this.audioElement.src = audioUrl;
    this.audioElement.preload = "metadata";

    // Build DOM
    this.buildDOM();
    this.attachEvents();
  }

  public destroy() {
    this.pause();
    
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
    }

    // Remove window event listeners
    window.removeEventListener("mousemove", this.handlers.mousemove);
    window.removeEventListener("mouseup", this.handlers.mouseup);
    window.removeEventListener("touchmove", this.handlers.touchmove);
    window.removeEventListener("touchend", this.handlers.touchend);

    // Clean up audio
    this.audioElement.pause();
    this.audioElement.src = "";
    this.audioElement.load();
    
    if (this.audioContext) {
      this.audioContext.close();
    }

    // Clear container
    this.container.innerHTML = "";
    this.container.classList.remove("audio-visualizer");
  }

  private buildDOM() {
    this.container.classList.add("audio-visualizer");
    this.container.innerHTML = `
      <button class="av-play-btn" aria-label="Play">
        <svg viewBox="0 0 24 24">
          <path d="M8 5v14l11-7z" class="av-icon-play" />
          <path d="M6 19h4V5H6v14zm8-14v14h4V5h-4z" class="av-icon-pause" style="display:none;" />
        </svg>
      </button>
      <div class="av-content">
        <div class="av-top-row">
          <div class="av-wave-container"></div>
          <div class="av-time">00:00</div>
        </div>
        <div class="av-progress-track">
          <div class="av-progress-bg">
            <div class="av-progress-fill"></div>
          </div>
        </div>
        <div class="av-volume-container">
          <svg viewBox="0 0 24 24" class="av-icon-volume"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
          <div class="av-volume-track">
            <div class="av-volume-bg">
              <div class="av-volume-fill"></div>
            </div>
          </div>
        </div>
        <div class="av-loading">Loading...</div>
        <div class="av-error" style="display:none;"></div>
      </div>
    `;

    this.playBtn = this.container.querySelector(".av-play-btn")!;
    this.progressTrack = this.container.querySelector(".av-progress-track")!;
    this.progressFill = this.container.querySelector(".av-progress-fill")!;
    this.timeDisplay = this.container.querySelector(".av-time")!;
    this.waveContainer = this.container.querySelector(".av-wave-container")!;
    this.errorDisplay = this.container.querySelector(".av-error")!;
    this.loadingDisplay = this.container.querySelector(".av-loading")!;
    this.volumeTrack = this.container.querySelector(".av-volume-track")!;
    this.volumeFill = this.container.querySelector(".av-volume-fill")!;

    // Initial Volume setup
    this.audioElement.volume = 1;
    this.volumeFill.style.transform = `scaleX(1)`;

    // Create Wave Bars
    for (let i = 0; i < this.numBars; i++) {
      const bar = document.createElement("div");
      bar.className = "av-bar";
      bar.style.height = "2px"; // Initial flat state
      this.bars.push(bar);
      this.waveContainer.appendChild(bar);
    }
  }

  private formatTime(seconds: number): string {
    if (isNaN(seconds) || seconds < 0 || !isFinite(seconds)) return "00:00";
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }

  private async initAudio() {
    if (this.isLoaded) return;
    
    try {
      this.loadingDisplay.classList.add("visible");
      
      // We only need to set src if not already set, but we set it in constructor.
      if (!this.audioElement.src) {
        this.audioElement.src = this.audioUrl;
        await this.audioElement.load();
      }

      if (!this.audioContext) {
        const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
        this.audioContext = new AudioContext();
        this.analyser = this.audioContext.createAnalyser();
        
        // Smaller fft size for smooth bars
        this.analyser.fftSize = 256; 
        
        this.sourceNode = this.audioContext.createMediaElementSource(this.audioElement);
        this.sourceNode.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
      }
      
      if (this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      this.isLoaded = true;
      this.loadingDisplay.classList.remove("visible");
    } catch (err: any) {
      console.error("Audio Load Error:", err);
      this.loadingDisplay.classList.remove("visible");
      this.errorDisplay.style.display = "block";
      this.errorDisplay.textContent = "Failed to load audio.";
      throw err;
    }
  }

  private attachEvents() {
    this.playBtn.addEventListener("click", () => this.togglePlay());
    
    this.audioElement.addEventListener("timeupdate", () => this.updateProgress());
    this.audioElement.addEventListener("loadedmetadata", () => {
      if (this.audioElement.duration === Infinity) {
        // Chromium WebM duration bug workaround
        this.audioElement.currentTime = 1e101;
        this.audioElement.addEventListener("timeupdate", () => {
          this.audioElement.currentTime = 0;
          this.timeDisplay.textContent = this.formatTime(this.audioElement.duration);
        }, { once: true });
      } else {
        this.timeDisplay.textContent = this.formatTime(this.audioElement.duration);
      }
    });
    this.audioElement.addEventListener("ended", () => {
      this.pause();
      this.audioElement.currentTime = 0;
      this.updateProgress();
    });
    this.audioElement.addEventListener("error", (e) => {
      this.errorDisplay.style.display = "block";
      this.errorDisplay.textContent = "Error loading audio.";
    });

    // Touch / Click Scrubbing for Progress
    let isDraggingProgress = false;
    
    const handleProgressMove = (clientX: number) => {
      const rect = this.progressTrack.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.max(0, Math.min(1, percent));
      if (this.audioElement.duration) {
        this.audioElement.currentTime = percent * this.audioElement.duration;
      }
      this.progressFill.style.transform = `scaleX(${percent})`;
    };

    this.progressTrack.addEventListener("mousedown", (e) => {
      isDraggingProgress = true;
      handleProgressMove(e.clientX);
    });
    
    this.progressTrack.addEventListener("touchstart", (e) => {
      isDraggingProgress = true;
      handleProgressMove(e.touches[0].clientX);
    }, { passive: true });

    // Volume Scrubbing
    let isDraggingVolume = false;
    const handleVolumeMove = (clientX: number) => {
      const rect = this.volumeTrack.getBoundingClientRect();
      let percent = (clientX - rect.left) / rect.width;
      percent = Math.max(0, Math.min(1, percent));
      this.audioElement.volume = percent;
      this.volumeFill.style.transform = `scaleX(${percent})`;
    };

    this.volumeTrack.addEventListener("mousedown", (e) => {
      isDraggingVolume = true;
      handleVolumeMove(e.clientX);
    });

    this.volumeTrack.addEventListener("touchstart", (e) => {
      isDraggingVolume = true;
      handleVolumeMove(e.touches[0].clientX);
    }, { passive: true });

    this.handlers.mousemove = (e: MouseEvent) => {
      if (isDraggingProgress) handleProgressMove(e.clientX);
      if (isDraggingVolume) handleVolumeMove(e.clientX);
    };
    this.handlers.mouseup = () => {
      isDraggingProgress = false;
      isDraggingVolume = false;
    };
    this.handlers.touchmove = (e: TouchEvent) => {
      if (isDraggingProgress) handleProgressMove(e.touches[0].clientX);
      if (isDraggingVolume) handleVolumeMove(e.touches[0].clientX);
    };
    this.handlers.touchend = () => {
      isDraggingProgress = false;
      isDraggingVolume = false;
    };

    window.addEventListener("mousemove", this.handlers.mousemove);
    window.addEventListener("mouseup", this.handlers.mouseup);
    window.addEventListener("touchmove", this.handlers.touchmove, { passive: true });
    window.addEventListener("touchend", this.handlers.touchend);
  }

  private updateProgress() {
    if (!this.audioElement.duration) return;
    const percent = this.audioElement.currentTime / this.audioElement.duration;
    this.progressFill.style.transform = `scaleX(${percent})`;
    this.timeDisplay.textContent = this.formatTime(this.audioElement.currentTime);
    
    // Color bars based on progress (like Telegram)
    const activeIndex = Math.floor(percent * this.numBars);
    this.bars.forEach((bar, index) => {
      if (index <= activeIndex) {
        bar.classList.add("active");
      } else {
        bar.classList.remove("active");
      }
    });
  }

  private toggleIcons(play: boolean) {
    const playIcon = this.playBtn.querySelector(".av-icon-play") as HTMLElement;
    const pauseIcon = this.playBtn.querySelector(".av-icon-pause") as HTMLElement;
    if (play) {
      playIcon.style.display = "none";
      pauseIcon.style.display = "block";
    } else {
      playIcon.style.display = "block";
      pauseIcon.style.display = "none";
    }
  }

  public async togglePlay() {
    try {
      if (!this.isLoaded) {
        await this.initAudio();
      }
      
      if (this.audioContext && this.audioContext.state === "suspended") {
        await this.audioContext.resume();
      }

      if (this.isPlaying) {
        this.pause();
      } else {
        this.play();
      }
    } catch (e) {
      console.error("Error toggling play:", e);
    }
  }

  private play() {
    this.audioElement.play().then(() => {
      this.isPlaying = true;
      this.toggleIcons(true);
      this.renderFrame();
    }).catch(err => {
      console.error("Play error:", err);
      this.errorDisplay.style.display = "block";
      this.errorDisplay.textContent = "Playback failed.";
    });
  }

  private pause() {
    this.audioElement.pause();
    this.isPlaying = false;
    this.toggleIcons(false);
    if (this.animationId) {
      cancelAnimationFrame(this.animationId);
      this.animationId = null;
    }
    // Return bars to rest state
    this.bars.forEach(bar => {
      bar.style.height = "2px";
    });
  }

  private renderFrame = () => {
    if (!this.isPlaying || !this.analyser) return;

    const dataArray = new Uint8Array(this.analyser.frequencyBinCount);
    this.analyser.getByteFrequencyData(dataArray);

    // Map frequency data to our bars
    // We only use the lower half of frequencies for speech usually
    const step = Math.floor((dataArray.length / 2) / this.numBars);
    
    for (let i = 0; i < this.numBars; i++) {
      let sum = 0;
      for (let j = 0; j < step; j++) {
        sum += dataArray[i * step + j] || 0;
      }
      const average = sum / step;
      
      // Calculate height (max height is 24px)
      // Base height 2px, plus up to 22px based on volume (0-255)
      const height = 2 + (average / 255) * 22;
      
      // Smooth easing is handled by CSS transitions, but we can also do math here.
      // For performance, direct style updates on small elements is fine.
      this.bars[i].style.height = `${height}px`;
    }

    this.animationId = requestAnimationFrame(this.renderFrame);
  }
}
