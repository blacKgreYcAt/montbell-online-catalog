/**
 * 檢查展示會是否已結束
 * 結單日期：2026 年 7 月 9 日下午 17:00
 */
export function isAfterDeadline(): boolean {
  // 當前日期
  const now = new Date();

  // 結單截止日期：2026-07-09 17:00:00
  const deadline = new Date(2026, 6, 9, 17, 0, 0); // 月份是0-indexed

  // 如果當前時間已超過截止日期，視為已結束
  return now > deadline;
}

/**
 * 獲取距離結單的天數（負數表示已過期）
 */
export function getDaysUntilDeadline(): number {
  const now = new Date();
  const deadline = new Date(2026, 6, 9, 17, 0, 0);
  const diff = deadline.getTime() - now.getTime();
  return Math.ceil(diff / (1000 * 60 * 60 * 24));
}
