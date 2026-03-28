"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { Mic, Square, Pause, Play, X, Loader2, AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import "./voice-message.css"

interface VoiceRecorderProps {
  onRecordingComplete: (blob: Blob, duration: number) => void
  onCancel?: () => void
  maxDuration?: number
  disabled?: boolean
}

interface VoiceMessageProps {
  src: string
  duration?: number
  senderName?: string
  senderAvatar?: string
  isCurrentUser?: boolean
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  className?: string
}

type RecordingState = "idle" | "recording" | "paused" | "processing"

export function VoiceRecorder({
  onRecordingComplete,
  onCancel,
  maxDuration = 120,
  disabled = false
}: VoiceRecorderProps) {
  const [state, setState] = useState<RecordingState>("idle")
  const [duration, setDuration] = useState(0)
  const [audioLevels, setAudioLevels] = useState<number[]>(Array(20).fill(0))
  const [error, setError] = useState<string | null>(null)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const audioContextRef = useRef<AudioContext | null>(null)
  const analyserRef = useRef<AnalyserNode | null>(null)
  const chunksRef = useRef<Blob[]>([])
  const animationFrameRef = useRef<number | null>(null)
  const timerRef = useRef<NodeJS.Timeout | null>(null)
  const startTimeRef = useRef<number>(0)
  const pausedDurationRef = useRef<number>(0)
  const lastTouchRef = useRef<number>(0)

  const getSupportedMimeType = useCallback(() => {
    if (typeof MediaRecorder === "undefined" || !MediaRecorder.isTypeSupported) return "audio/webm"
    const types = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus",
      "audio/ogg"
    ]
    return types.find(t => MediaRecorder.isTypeSupported(t)) || "audio/webm"
  }, [])

  const stopMediaTracks = useCallback(() => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach(t => t.stop())
      mediaStreamRef.current = null
    }
  }, [])

  const cleanup = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current)
      animationFrameRef.current = null
    }
    if (timerRef.current) {
      clearInterval(timerRef.current)
      timerRef.current = null
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close()
      audioContextRef.current = null
    }
    analyserRef.current = null
    stopMediaTracks()
    chunksRef.current = []
  }, [stopMediaTracks])

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (state === "idle") {
        if (e.code === "KeyR" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          const active = document.activeElement
          if (active?.tagName !== "INPUT" && active?.tagName !== "TEXTAREA") {
            e.preventDefault()
            startRecording()
          }
        }
      } else if (state === "recording" || state === "paused") {
        if (e.code === "Space") {
          e.preventDefault()
          if (state === "recording") pauseRecording()
          else resumeRecording()
        } else if (e.code === "KeyS" && !e.ctrlKey && !e.metaKey && !e.altKey) {
          e.preventDefault()
          stopRecording()
        } else if (e.code === "Escape") {
          e.preventDefault()
          cancelRecording()
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [state])

  useEffect(() => {
    const handleTouchStart = (e: TouchEvent) => {
      if (state !== "idle" && !disabled) {
        lastTouchRef.current = Date.now()
      }
    }

    const handleTouchEnd = (e: TouchEvent) => {
      if (state !== "idle" && !disabled && lastTouchRef.current) {
        const duration = Date.now() - lastTouchRef.current
        if (duration > 500) {
        }
      }
    }

    window.addEventListener("touchstart", handleTouchStart, { passive: true })
    window.addEventListener("touchend", handleTouchEnd)
    return () => {
      window.removeEventListener("touchstart", handleTouchStart)
      window.removeEventListener("touchend", handleTouchEnd)
    }
  }, [state, disabled])

  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const updateAudioLevels = useCallback(() => {
    if (!analyserRef.current || state !== "recording") return
    const data = new Uint8Array(analyserRef.current.frequencyBinCount)
    analyserRef.current.getByteFrequencyData(data)
    const step = Math.floor(data.length / 20)
    const levels = Array(20).fill(0).map((_, i) => {
      const val = data[i * step]
      return Math.max(2, (val / 255) * 24)
    })
    setAudioLevels(levels)
    animationFrameRef.current = requestAnimationFrame(updateAudioLevels)
  }, [state])

  const startRecording = async () => {
    if (disabled || state !== "idle") return
    setError(null)

    try {
      if (!navigator.mediaDevices?.getUserMedia) {
        throw new Error("Микрофон не поддерживается")
      }

      const stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true
        }
      })
      mediaStreamRef.current = stream

      audioContextRef.current = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)()
      analyserRef.current = audioContextRef.current.createAnalyser()
      analyserRef.current.fftSize = 64
      const source = audioContextRef.current.createMediaStreamSource(stream)
      source.connect(analyserRef.current)

      const mimeType = getSupportedMimeType()
      const mediaRecorder = new MediaRecorder(stream, { mimeType })
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data)
      }

      mediaRecorder.onerror = () => {
        setError("Ошибка записи")
        setState("idle")
        cleanup()
      }

      mediaRecorder.onstop = () => {
        const totalDuration = (Date.now() - startTimeRef.current + pausedDurationRef.current) / 1000
        if (chunksRef.current.length === 0 || totalDuration < 0.5) {
          setError("Слишком короткая запись")
          setState("idle")
          cleanup()
          return
        }
        const blob = new Blob(chunksRef.current, { type: mimeType })
        setState("processing")
        onRecordingComplete(blob, totalDuration)
        cleanup()
        setState("idle")
      }

      mediaRecorder.start(100)
      startTimeRef.current = Date.now()
      pausedDurationRef.current = 0
      setState("recording")
      updateAudioLevels()

      timerRef.current = setInterval(() => {
        setDuration(Math.floor((Date.now() - startTimeRef.current + pausedDurationRef.current) / 1000))
        if (duration >= maxDuration) stopRecording()
      }, 100)
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Не удалось начать запись"
      setError(msg)
      cleanup()
    }
  }

  const pauseRecording = () => {
    if (state !== "recording" || !mediaRecorderRef.current) return
    mediaRecorderRef.current.pause()
    pausedDurationRef.current += Date.now() - startTimeRef.current
    startTimeRef.current = 0
    if (timerRef.current) clearInterval(timerRef.current)
    if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current)
    setAudioLevels(Array(20).fill(2))
    setState("paused")
  }

  const resumeRecording = async () => {
    if (state !== "paused" || !mediaRecorderRef.current) return
    if (audioContextRef.current?.state === "suspended") {
      await audioContextRef.current.resume()
    }
    startTimeRef.current = Date.now()
    mediaRecorderRef.current.resume()
    setState("recording")
    updateAudioLevels()
    timerRef.current = setInterval(() => {
      setDuration(Math.floor((Date.now() - startTimeRef.current + pausedDurationRef.current) / 1000))
      if (duration >= maxDuration) stopRecording()
    }, 100)
  }

  const stopRecording = () => {
    if (!mediaRecorderRef.current || state === "idle" || state === "processing") return
    if (mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setState("processing")
  }

  const cancelRecording = () => {
    cleanup()
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
    setState("idle")
    setDuration(0)
    setAudioLevels(Array(20).fill(0))
    setError(null)
    onCancel?.()
  }

  const formatDuration = (sec: number) => {
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  if (state === "idle") {
    return (
      <div className="voice-recorder">
        <button
          className={cn("voice-rec-btn voice-rec-start", disabled && "disabled")}
          onClick={startRecording}
          disabled={disabled}
          aria-label="Начать запись"
        >
          <Mic className="voice-rec-icon" />
        </button>
      </div>
    )
  }

  return (
    <div className={cn("voice-recorder", state)}>
      <div className="voice-rec-visualizer">
        {audioLevels.map((h, i) => (
          <div
            key={i}
            className="voice-rec-bar"
            style={{ height: `${h}px` }}
          />
        ))}
      </div>

      <div className="voice-rec-info">
        <span className="voice-rec-time">{formatDuration(duration)}</span>
        {error && (
          <span className="voice-rec-error">
            <AlertCircle className="w-3 h-3" />
            {error}
          </span>
        )}
        {state === "recording" && (
          <span className="voice-rec-status recording">Запись</span>
        )}
        {state === "paused" && (
          <span className="voice-rec-status paused">Пауза</span>
        )}
        {state === "processing" && (
          <span className="voice-rec-status processing">
            <Loader2 className="w-3 h-3 animate-spin" />
            Обработка
          </span>
        )}
      </div>

      <div className="voice-rec-controls">
        {state === "recording" && (
          <>
            <button
              className="voice-rec-btn voice-rec-pause"
              onClick={pauseRecording}
              aria-label="Пауза"
            >
              <Pause className="w-4 h-4" />
            </button>
            <button
              className="voice-rec-btn voice-rec-stop"
              onClick={stopRecording}
              aria-label="Завершить"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        )}
        {state === "paused" && (
          <>
            <button
              className="voice-rec-btn voice-rec-resume"
              onClick={resumeRecording}
              aria-label="Продолжить"
            >
              <Play className="w-4 h-4" />
            </button>
            <button
              className="voice-rec-btn voice-rec-stop"
              onClick={stopRecording}
              aria-label="Завершить"
            >
              <Square className="w-4 h-4" />
            </button>
          </>
        )}
        <button
          className="voice-rec-btn voice-rec-cancel"
          onClick={cancelRecording}
          aria-label="Отмена"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  )
}

export function VoiceMessage({
  src,
  duration: initialDuration,
  senderName,
  senderAvatar,
  isCurrentUser = false,
  onPlay,
  onPause,
  onEnded,
  className
}: VoiceMessageProps) {
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(initialDuration || 0)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  const audioRef = useRef<HTMLAudioElement>(null)
  const progressRef = useRef<HTMLDivElement>(null)

  const formatTime = (sec: number) => {
    if (!isFinite(sec) || isNaN(sec)) return "0:00"
    const m = Math.floor(sec / 60)
    const s = Math.floor(sec % 60)
    return `${m}:${s.toString().padStart(2, "0")}`
  }

  const handleLoadedMetadata = () => {
    if (!audioRef.current) return
    setIsLoaded(true)

    const d = audioRef.current.duration
    if (d === Infinity) {
      audioRef.current.currentTime = 1e101
      audioRef.current.addEventListener("timeupdate", () => {
        audioRef.current!.currentTime = 0
        if (!initialDuration) {
          setDuration(audioRef.current!.duration)
        }
      }, { once: true })
    } else {
      if (!initialDuration) {
        setDuration(d)
      }
    }
  }

  const handleTimeUpdate = () => {
    if (!audioRef.current) return
    setCurrentTime(audioRef.current.currentTime)
  }

  const handleEnded = () => {
    setIsPlaying(false)
    setCurrentTime(0)
    onEnded?.()
  }

  const handleError = () => {
    setError("Ошибка воспроизведения")
    setIsPlaying(false)
  }

  const togglePlay = async () => {
    if (!audioRef.current || error) return
    try {
      if (isPlaying) {
        audioRef.current.pause()
        onPause?.()
      } else {
        await audioRef.current.play()
        onPlay?.()
      }
      setIsPlaying(!isPlaying)
    } catch {
      setError("Не удалось воспроизвести")
    }
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !isLoaded) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.clientX - rect.left) / rect.width))
    const newTime = percent * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const handleProgressTouch = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!progressRef.current || !audioRef.current || !isLoaded) return
    const rect = progressRef.current.getBoundingClientRect()
    const percent = Math.max(0, Math.min(1, (e.touches[0].clientX - rect.left) / rect.width))
    const newTime = percent * duration
    audioRef.current.currentTime = newTime
    setCurrentTime(newTime)
  }

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isLoaded || error) return
      const active = document.activeElement
      if (active?.tagName === "INPUT" || active?.tagName === "TEXTAREA") return

      if (e.code === "Space") {
        e.preventDefault()
        togglePlay()
      } else if (e.code === "ArrowLeft") {
        e.preventDefault()
        if (audioRef.current) {
          audioRef.current.currentTime = Math.max(0, currentTime - 5)
          setCurrentTime(audioRef.current.currentTime)
        }
      } else if (e.code === "ArrowRight") {
        e.preventDefault()
        if (audioRef.current) {
          audioRef.current.currentTime = Math.min(duration, currentTime + 5)
          setCurrentTime(audioRef.current.currentTime)
        }
      }
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [isLoaded, error, isPlaying, currentTime, duration])

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return
    audio.addEventListener("loadedmetadata", handleLoadedMetadata)
    audio.addEventListener("timeupdate", handleTimeUpdate)
    audio.addEventListener("ended", handleEnded)
    audio.addEventListener("error", handleError)
    return () => {
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata)
      audio.removeEventListener("timeupdate", handleTimeUpdate)
      audio.removeEventListener("ended", handleEnded)
      audio.removeEventListener("error", handleError)
    }
  }, [error])

  const progressBars = Array(20).fill(0).map((_, i) => {
    const barProgress = (i / 20) * 100
    const isActive = barProgress <= progress
    return (
      <div
        key={i}
        className={cn("vm-bar", isActive && "active")}
        style={{
          height: `${Math.random() * 12 + 4}px`,
          animationDelay: `${i * 30}ms`
        }}
      />
    )
  })

  return (
    <div
      className={cn(
        "voice-message",
        isCurrentUser && "current-user",
        error && "has-error",
        className
      )}
    >
      <audio ref={audioRef} src={src} preload="metadata" />

      <button
        className="vm-play-btn"
        onClick={togglePlay}
        disabled={!!error}
        aria-label={isPlaying ? "Пауза" : "Воспроизвести"}
      >
        {error ? (
          <AlertCircle className="w-5 h-5" />
        ) : isPlaying ? (
          <Pause className="w-5 h-5" />
        ) : (
          <Play className="w-5 h-5 ml-0.5" />
        )}
      </button>

      <div className="vm-content">
        <div className="vm-wave" ref={progressRef} onClick={handleProgressClick} onTouchMove={handleProgressTouch}>
          {progressBars}
          <div className="vm-progress-track">
            <div className="vm-progress-fill" style={{ width: `${progress}%` }} />
          </div>
        </div>

        <div className="vm-footer">
          <span className="vm-time">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
          {senderName && (
            <span className="vm-sender">{senderName}</span>
          )}
        </div>
      </div>
    </div>
  )
}