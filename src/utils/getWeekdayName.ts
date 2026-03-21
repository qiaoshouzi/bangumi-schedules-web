export const getWeekdayName = (dayIndex: number, locale: Intl.LocalesArgument = 'zh-Hans') => {
  // 创建一个日期对象，2024年3月10日刚好是周日 (Index 0)
  // 如果输入 0 代表周日，1 代表周一，以此类推
  const baseDate = new Date(2024, 2, 10 + dayIndex)

  return new Intl.DateTimeFormat(locale, { weekday: 'long' }).format(baseDate)
}
