/**
 * ランダムな事例IDを生成する（8文字の英小文字+数字）
 * 例: "a1b2c3d4", "x9k3m7p2"
 */
export function generateCaseId(): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const arr = crypto.getRandomValues(new Uint8Array(8))
  return Array.from(arr, (b) => chars[b % chars.length]).join('')
}
