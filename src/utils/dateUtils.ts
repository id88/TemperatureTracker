/**
 * 日期处理工具函数
 */

// 获取指定日期范围内的所有月份
export function getMonthsBetween(startDate: Date, endDate: Date): { year: string; month: string }[] {
  const months: { year: string; month: string }[] = []
  const currentDate = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  const lastDate = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  while (currentDate <= lastDate) {
    months.push({
      year: currentDate.getFullYear().toString(),
      month: (currentDate.getMonth() + 1).toString().padStart(2, '0')
    })
    currentDate.setMonth(currentDate.getMonth() + 1)
  }

  return months
}

// 检查是否是未来日期
export function isFutureDate(date: Date): boolean {
  const now = new Date()
  const lastDayOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0)
  return date.getTime() > lastDayOfMonth.getTime()
}

// 计算月份差
export function getMonthDiff(startDate: Date, endDate: Date): number {
  return (endDate.getFullYear() - startDate.getFullYear()) * 12 + 
         (endDate.getMonth() - startDate.getMonth())
}

// 格式化日期为 YYYY-MM-DD
export function formatDate(date: Date): string {
  return date.toISOString().split('T')[0]
} 