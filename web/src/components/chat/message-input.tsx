"use client"

import { useState, useRef, useEffect, useMemo, useCallback } from "react"
import { Mic, Paperclip, Send, X, StopCircle } from "lucide-react"
import { uploadFile } from "@/app/actions/upload"

import { useTranslation } from "@/lib/language-context"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { cn } from "@/lib/utils"
import { sendMessageAction, updateTypingStatus } from "@/app/actions/chat"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { getMentionCandidates, splitTextWithMentions } from "@/lib/chat-mentions"

interface MessageInputProps {
  roomId: string
  userId: string
  userRole?: string
  participants?: Array<{
    id: string
    full_name: string | null
    avatar_url?: string | null
  }>
  replyTo?: {
    id: string
    content?: string | null
    sender_name?: string | null
  } | null
  onCancelReply?: () => void
  onMessageSent?: () => void
}

export function MessageInput({ 
  roomId, 
  userId, 
  userRole, 
  participants = [],
  replyTo, 
  onCancelReply,
  onMessageSent
}: MessageInputProps) {
  const MENTION_CURSOR_SPACES = " "
  const { t } = useTranslation()
  const [message, setMessage] = useState("")
  const [isRecording, setIsRecording] = useState(false)
  const [isUploading, setIsUploading] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [mentionQuery, setMentionQuery] = useState("")
  const [mentionStart, setMentionStart] = useState<number | null>(null)
  const [isMentionOpen, setIsMentionOpen] = useState(false)
  const [activeMentionIndex, setActiveMentionIndex] = useState(0)
  const [isInputFocused, setIsInputFocused] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement | null>(null)
  const pendingCursorPositionRef = useRef<number | null>(null)
  const lastTypingUpdateRef = useRef<number>(0)

  const mentionUsers = useMemo(() => {
    const avatarsById = new Map(
      participants.map((participant) => [participant.id, participant.avatar_url || null])
    )

    const candidates = getMentionCandidates(
      participants.map((participant) => ({
        id: participant.id,
        full_name: participant.full_name,
      }))
    )

    return candidates.map((candidate) => ({
      ...candidate,
      avatar_url: avatarsById.get(candidate.id) || null,
    }))
  }, [participants])

  const mentionSearch = mentionQuery.trim().toLowerCase()
  const mentionCandidates = useMemo(
    () =>
      mentionUsers
        .filter((participant) => participant.id !== userId)
        .filter(
          (participant) =>
            mentionSearch.length === 0 ||
            participant.handle.includes(mentionSearch) ||
            (participant.full_name || "").toLowerCase().includes(mentionSearch)
        )
        .slice(0, 8),
    [mentionUsers, mentionSearch, userId]
  )

  const highlightedDraft = useMemo(
    () =>
      splitTextWithMentions(
        message,
        mentionUsers.map((participant) => ({ id: participant.id, full_name: participant.full_name }))
      ),
    [message, mentionUsers]
  )

  const focusInputWithCursor = useCallback((position: number, maxLength?: number) => {
    if (!textareaRef.current) return
    const inputLength = typeof maxLength === "number" ? maxLength : message.length
    const nextPosition = Math.min(Math.max(position, 0), inputLength)

    textareaRef.current.focus({ preventScroll: true })
    textareaRef.current.setSelectionRange(nextPosition, nextPosition)
    textareaRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" })
  }, [message.length])

  const updateMentionContext = (value: string, cursorPosition: number) => {
    const beforeCursor = value.slice(0, cursorPosition)
    const mentionMatch = beforeCursor.match(/(^|[\s([{])@([\p{L}\p{N}_]*)$/u)

    if (!mentionMatch) {
      setIsMentionOpen(false)
      setMentionQuery("")
      setMentionStart(null)
      setActiveMentionIndex(0)
      return
    }

    const query = mentionMatch[2] || ""
    const matchText = mentionMatch[0]
    const atIndex = cursorPosition - matchText.length + matchText.indexOf("@")

    setMentionStart(atIndex)
    setMentionQuery(query)
    setIsMentionOpen(true)
    setActiveMentionIndex(0)
  }

  const applyMention = (user: { handle: string }) => {
    if (!textareaRef.current || mentionStart === null) return

    const cursor = textareaRef.current.selectionStart ?? message.length
    const nextValue = `${message.slice(0, mentionStart)}@${user.handle}${MENTION_CURSOR_SPACES}${message.slice(cursor)}`
    const nextCursorPosition = mentionStart + user.handle.length + 1 + MENTION_CURSOR_SPACES.length

    pendingCursorPositionRef.current = nextCursorPosition
    setMessage(nextValue)
    setIsMentionOpen(false)
    setMentionQuery("")
    setMentionStart(null)
    setActiveMentionIndex(0)
  }

  // Notify server when typing
  useEffect(() => {
    if (message.trim() && Date.now() - lastTypingUpdateRef.current > 5000) {
      lastTypingUpdateRef.current = Date.now()
      updateTypingStatus(roomId)
    }
  }, [message, roomId])

  useEffect(() => {
    if (pendingCursorPositionRef.current === null) return
    const cursorPosition = pendingCursorPositionRef.current
    pendingCursorPositionRef.current = null
    focusInputWithCursor(cursorPosition, message.length)
  }, [focusInputWithCursor, message.length])

  useEffect(() => {
    setIsMentionOpen(false)
    setMentionQuery("")
    setMentionStart(null)
    setActiveMentionIndex(0)
  }, [participants, userId])

  useEffect(() => {
    if (!isInputFocused || !textareaRef.current) return

    const viewport = window.visualViewport
    if (!viewport) return

    const ensureVisibleOnKeyboard = () => {
      if (!textareaRef.current) return
      textareaRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" })
    }

    viewport.addEventListener("resize", ensureVisibleOnKeyboard)
    viewport.addEventListener("scroll", ensureVisibleOnKeyboard)

    return () => {
      viewport.removeEventListener("resize", ensureVisibleOnKeyboard)
      viewport.removeEventListener("scroll", ensureVisibleOnKeyboard)
    }
  }, [isInputFocused])

  // Cleanup preview URL on unmount or file change
  useEffect(() => {
    return () => {
      if (previewUrl) {
        URL.revokeObjectURL(previewUrl)
      }
    }
  }, [previewUrl])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const selectedFile = e.target.files[0]
      setFile(selectedFile)
      
      // Create preview for images
      if (selectedFile.type.startsWith('image/')) {
        const url = URL.createObjectURL(selectedFile)
        setPreviewUrl(url)
      } else {
        setPreviewUrl(null)
      }
    }
  }

  const removeFile = () => {
    setFile(null)
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
      setPreviewUrl(null)
    }
  }

  const handleSend = async () => {
    if ((!message.trim() && !file) || isUploading) return

    setIsUploading(true)

    try {
      let fileUrl = undefined
      let messageType: "text" | "voice" | "file" = "text"
      let content = message

      // Handle file upload
      if (file) {
        messageType = "file"
        const formData = new FormData()
        formData.append("file", file)
        
        const result = await uploadFile(formData)
        if (result.error || !result.url) throw new Error(result.error || "Upload failed")
        
        fileUrl = result.url
        content = file.name
      }

      // Call Server Action
      console.log("Calling sendMessageAction with:", { roomId, messageType, content, replyToId: replyTo?.id });
      const result = await sendMessageAction({
        roomId,
        content: content || (file ? file.name : ""),
        messageType,
        fileUrl,
        replyToId: replyTo?.id,
        userRole,
      })
      console.log("sendMessageAction result:", result);

      if (result.error) {
        throw new Error(result.error)
      }

      setMessage("")
      removeFile()
      if (onCancelReply) onCancelReply()
      if (onMessageSent) onMessageSent()
    } catch (error) {
      console.error("Error sending message:", error)
      alert(t("chat.errorSendMessage"))
    } finally {
      setIsUploading(false)
    }
  }

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const mediaStreamRef = useRef<MediaStream | null>(null)
  const chunksRef = useRef<Blob[]>([])

  const stopMediaTracks = () => {
    mediaStreamRef.current?.getTracks().forEach((track) => track.stop())
    mediaStreamRef.current = null
  }

  const getSupportedAudioMimeType = () => {
    if (typeof MediaRecorder === "undefined" || typeof MediaRecorder.isTypeSupported !== "function") {
      return ""
    }

    const preferredMimeTypes = [
      "audio/webm;codecs=opus",
      "audio/webm",
      "audio/mp4",
      "audio/aac",
      "audio/ogg;codecs=opus",
      "audio/ogg",
    ]

    return preferredMimeTypes.find((mimeType) => MediaRecorder.isTypeSupported(mimeType)) || ""
  }

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current) {
        mediaRecorderRef.current.onstop = null
        if (mediaRecorderRef.current.state !== "inactive") {
          mediaRecorderRef.current.stop()
        }
      }
      stopMediaTracks()
      chunksRef.current = []
    }
  }, [])

  const startRecording = async () => {
    if (isUploading || isRecording) return

    try {
      if (!navigator.mediaDevices?.getUserMedia || typeof MediaRecorder === "undefined") {
        alert(t("chat.errorMic"))
        return
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaStreamRef.current = stream
      const mimeType = getSupportedAudioMimeType()
      const mediaRecorder = mimeType
        ? new MediaRecorder(stream, { mimeType })
        : new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      chunksRef.current = []

      mediaRecorder.onerror = () => {
        setIsRecording(false)
        stopMediaTracks()
        alert(t("chat.errorSendVoice"))
      }

      mediaRecorder.ondataavailable = (e) => {
        if (e.data.size > 0) {
          chunksRef.current.push(e.data)
        }
      }

      mediaRecorder.onstop = async () => {
        setIsRecording(false)

        const hasAudioData = chunksRef.current.some((chunk) => chunk.size > 0)
        if (!hasAudioData) {
          stopMediaTracks()
          alert(t("chat.errorSendVoice"))
          return
        }

        const detectedType = chunksRef.current[0]?.type || mediaRecorder.mimeType || "audio/webm"
        const fileExtension = detectedType.includes("mp4")
          ? "m4a"
          : detectedType.includes("ogg")
            ? "ogg"
            : "webm"
        const audioBlob = new Blob(chunksRef.current, { type: detectedType })
        const audioFile = new File([audioBlob], `voice-message.${fileExtension}`, { type: detectedType })
        
        setIsUploading(true)
        try {
          const formData = new FormData()
          formData.append("file", audioFile)
          
          const result = await uploadFile(formData)
          if (result.error || !result.url) throw new Error(result.error || "Upload failed")

          const sendResult = await sendMessageAction({
            roomId,
            content: t("chat.voiceMessageContent"),
            messageType: "voice",
            fileUrl: result.url,
        userRole,
          })

          if (sendResult.error) {
            throw new Error(sendResult.error)
          }

          if (onMessageSent) onMessageSent()
        } catch (error) {
          console.error("Error sending voice message:", error)
          alert(t("chat.errorSendVoice"))
        } finally {
          setIsUploading(false)
          chunksRef.current = []
          stopMediaTracks()
        }
      }

      mediaRecorder.start(250)
      setIsRecording(true)
    } catch (err) {
      console.error("Error accessing microphone:", err)
      setIsRecording(false)
      stopMediaTracks()
      alert(t("chat.errorMic"))
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state !== "inactive") {
      mediaRecorderRef.current.stop()
    }
  }

  return (
    <div className="p-2 md:p-4 border-t border-slate-200 bg-white/80 backdrop-blur-md sticky bottom-0 z-10 transition-all duration-300">
      <div className="max-w-4xl mx-auto space-y-2 md:space-y-3">
        {replyTo && (
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-blue-50/50 border border-blue-100 rounded-xl text-xs md:sm shadow-sm animate-slide-up relative">
            <div className="w-1 self-stretch bg-blue-500 rounded-full" />
            <div className="flex-1 min-w-0">
              <div className="font-bold text-blue-600 text-[10px] uppercase tracking-wider">
                {replyTo.sender_name}
              </div>
              <div className="text-slate-600 truncate text-[11px] md:text-xs">
                {replyTo.content}
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-6 w-6 rounded-full text-slate-400 hover:text-blue-600 hover:bg-blue-100/50"
              onClick={onCancelReply}
            >
              <X className="h-3.5 w-3.5" />
            </Button>
          </div>
        )}

        {file && (
          <div className="flex items-center gap-2 md:gap-3 p-2 md:p-3 bg-slate-50 border border-slate-200 rounded-xl text-xs md:sm shadow-sm animate-slide-up">
            {previewUrl ? (
              <div className="relative h-12 w-12 md:h-16 md:w-16 rounded-lg overflow-hidden border border-slate-200 bg-white shrink-0">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={previewUrl} alt="Preview" className="h-full w-full object-cover" />
              </div>
            ) : (
              <div className="bg-white p-1.5 md:p-2 rounded-lg border border-slate-100">
                <Paperclip className="h-3.5 w-3.5 md:h-4 md:w-4 text-amber-500" />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <div className="font-medium text-slate-700 truncate">{file.name}</div>
              <div className="text-[10px] md:text-xs text-slate-400">
                {(file.size / 1024 / 1024).toFixed(2)} MB
              </div>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 md:h-8 md:w-8 hover:bg-slate-200 rounded-full text-slate-400 hover:text-red-500"
              onClick={removeFile}
            >
              <X className="h-3.5 w-3.5 md:h-4 md:w-4" />
            </Button>
          </div>
        )}
        
        <div className="flex items-center gap-1.5 md:gap-3">
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            onChange={handleFileChange}
          />
          <Button
            variant="ghost"
            size="icon"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading || isRecording}
            className="shrink-0 h-9 w-9 md:h-12 md:w-12 rounded-full hover:bg-slate-100 text-slate-500 transition-colors"
          >
            <Paperclip className="h-4 w-4 md:h-5 md:w-5" />
          </Button>
          
          <div className="flex-1 relative">
            {message.length > 0 && !isInputFocused && (
              <div className="absolute inset-0 py-2 md:py-3 px-3 md:px-4 rounded-2xl md:rounded-3xl pointer-events-none whitespace-pre-wrap break-words overflow-hidden text-sm md:text-base leading-relaxed">
                {highlightedDraft.map((segment, index) => (
                  <span
                    key={`${segment.value}-${index}`}
                    className={segment.type === "mention" ? "bg-blue-100 text-blue-700 font-semibold rounded px-0.5" : "text-slate-800"}
                  >
                    {segment.value}
                  </span>
                ))}
              </div>
            )}
            <Textarea
              ref={textareaRef}
              value={message}
              onChange={(e) => {
                setMessage(e.target.value)
                updateMentionContext(e.target.value, e.target.selectionStart || 0)
              }}
              placeholder={isRecording ? t("chat.placeholderRecording") : t("chat.placeholderMessage")}
              className={cn(
                "min-h-[36px] md:min-h-[48px] h-9 md:h-12 max-h-32 py-2 md:py-3 px-3 md:px-4 rounded-2xl md:rounded-3xl border-slate-200 bg-slate-50 focus-visible:ring-amber-500 transition-all shadow-sm text-sm md:text-base resize-none scrollbar-none",
                isInputFocused && "border-blue-400 ring-2 ring-blue-200 shadow-[0_0_0_3px_rgba(59,130,246,0.12)]",
                isRecording && "border-red-500 bg-red-50 placeholder:text-red-400"
              )}
              onFocus={() => {
                setIsInputFocused(true)
                if (textareaRef.current) {
                  textareaRef.current.scrollIntoView({ block: "nearest", behavior: "smooth" })
                }
              }}
              onBlur={() => setIsInputFocused(false)}
              onKeyDown={(e) => {
                if (isMentionOpen && mentionCandidates.length > 0) {
                  if (e.key === "ArrowDown") {
                    e.preventDefault()
                    setActiveMentionIndex((prev) => (prev + 1) % mentionCandidates.length)
                    return
                  }

                  if (e.key === "ArrowUp") {
                    e.preventDefault()
                    setActiveMentionIndex((prev) => (prev - 1 + mentionCandidates.length) % mentionCandidates.length)
                    return
                  }

                  if (e.key === "Enter" || e.key === "Tab") {
                    e.preventDefault()
                    applyMention(mentionCandidates[activeMentionIndex])
                    return
                  }

                  if (e.key === "Escape") {
                    e.preventDefault()
                    setIsMentionOpen(false)
                    return
                  }
                }

                if (e.key === "Enter") {
                  const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
                  
                  if (isMobile) {
                    // On mobile: Enter = New Line, so we do nothing and let default behavior happen
                    return;
                  } else {
                    // On PC:
                    if (e.ctrlKey || e.metaKey) {
                      // Ctrl+Enter = New Line
                      // We don't preventDefault to allow newline
                    } else if (!e.shiftKey) {
                      // Enter (without modifiers) = Send
                      e.preventDefault();
                      handleSend();
                    }
                  }
                }
              }}
              onSelect={(e) => {
                const target = e.target as HTMLTextAreaElement
                updateMentionContext(target.value, target.selectionStart || 0)
              }}
              disabled={isUploading || isRecording}
            />
            {isMentionOpen && mentionCandidates.length > 0 && (
              <div className="absolute left-0 right-0 bottom-[calc(100%+8px)] bg-white border border-slate-200 rounded-xl shadow-lg overflow-hidden z-20">
                <div className="max-h-64 overflow-y-auto">
                  {mentionCandidates.map((candidate, index) => (
                    <button
                      key={candidate.id}
                      type="button"
                      onMouseDown={(e) => e.preventDefault()}
                      onClick={() => applyMention(candidate)}
                      className={cn(
                        "w-full px-3 py-2.5 text-left flex items-center gap-2.5 hover:bg-slate-50 transition-colors",
                        index === activeMentionIndex && "bg-blue-50"
                      )}
                    >
                      <Avatar className="h-7 w-7 ring-1 ring-slate-200">
                        <AvatarImage src={candidate.avatar_url || undefined} />
                        <AvatarFallback className="bg-slate-100 text-slate-700 text-[11px] font-semibold">
                          {candidate.full_name?.charAt(0) || "?"}
                        </AvatarFallback>
                      </Avatar>
                      <div className="min-w-0">
                        <div className="text-xs font-semibold text-slate-800 truncate">{candidate.full_name || "Unknown user"}</div>
                        <div className="text-[11px] text-slate-500 truncate">@{candidate.handle}</div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-1.5 md:gap-3 shrink-0">
            {message.trim() || file ? (
              <Button 
                onClick={handleSend} 
                disabled={isUploading || isRecording}
                size="icon"
                className="h-9 w-9 md:h-12 md:w-12 rounded-full bg-primary hover:bg-primary/90 text-primary-foreground shadow-md transition-all hover:scale-105 active:scale-95"
              >
                <Send className="h-4 w-4 md:h-5 md:w-5 ml-0.5" />
              </Button>
            ) : (
              <Button
                variant={isRecording ? "destructive" : "secondary"}
                size="icon"
                onClick={isRecording ? stopRecording : startRecording}
                disabled={isUploading}
                className={cn(
                  "h-9 w-9 md:h-12 md:w-12 rounded-full shadow-md transition-all hover:scale-105 active:scale-95",
                  isRecording ? "bg-red-500 hover:bg-red-600 text-white animate-pulse" : "bg-slate-100 hover:bg-slate-200 text-slate-600"
                )}
              >
                {isRecording ? (
                  <StopCircle className="h-4 w-4 md:h-5 md:w-5" />
                ) : (
                  <Mic className="h-4 w-4 md:h-5 md:w-5" />
                )}
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
