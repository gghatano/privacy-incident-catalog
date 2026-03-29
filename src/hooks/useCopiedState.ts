import { useState, useCallback, useRef, useEffect } from 'react'

/**
 * クリップボードコピー後の一時的なフィードバック状態を管理するhook。
 * copied が true になった後、指定時間後に自動で false に戻る。
 */
export function useCopiedState(timeout = 2000) {
  const [copied, setCopied] = useState(false)
  const timerRef = useRef<ReturnType<typeof setTimeout>>(undefined)

  const markCopied = useCallback(() => {
    setCopied(true)
    clearTimeout(timerRef.current)
    timerRef.current = setTimeout(() => setCopied(false), timeout)
  }, [timeout])

  useEffect(() => () => clearTimeout(timerRef.current), [])

  return { copied, markCopied }
}
