import type { Item as DataItem, Items as DataItems } from './getData'

type TimeInfo = {
  weekday: number
  hour: number
  minute: number
}
const getTimeInfo = (dateString: string): TimeInfo => {
  const date = new Date(dateString)

  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone: 'Asia/Tokyo',
    weekday: 'short',
    hour: 'numeric',
    minute: 'numeric',
    hour12: false,
  })

  const parts = formatter.formatToParts(date)
  const getPart = (type: string) => parts.find((p) => p.type === type)!.value

  const weekdayStr = getPart('weekday')
  let hour = parseInt(getPart('hour'))
  const minute = parseInt(getPart('minute'))

  const weekdayMap: Record<string, number> = {
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
    Sat: 6,
  }
  let weekday = weekdayMap[weekdayStr]

  // --- 28小时制逻辑转换 ---
  // 如果小时在 0, 1, 2, 3, 4 之间，视为前一天的 24, 25, 26, 27, 28 点
  if (hour <= 5) {
    hour += 24
    // 星期数减 1，如果是周日(0)减1则变为周六(6)
    weekday = (weekday - 1 + 7) % 7
  }

  return { weekday, hour, minute }
}

export type Items = (Item & { id: number })[]
export type Item = Omit<DataItem, 'schedules'> & {
  schedules: {
    time: TimeInfo
    items: DataItem['schedules']
  }[]
}

export const parseItems = (items: DataItems) => {
  const data: Items[] = Array.from({ length: 7 }, () => [])
  for (const [id, item] of Object.entries(items)) {
    const schedules: Item['schedules'] = []
    for (const i of item.schedules) {
      const time = getTimeInfo(i.time)
      let items: DataItem['schedules'] | undefined = schedules.find(
        ({ time: { weekday, hour, minute } }) =>
          weekday === time.weekday && hour === time.hour && minute === time.minute,
      )?.items
      if (!items) {
        items = []
        schedules.push({ time, items })
      }
      items.push(i)
    }
    for (const i of item.schedules) {
      const time = getTimeInfo(i.time)
      if (data[time.weekday].findIndex((v) => v.id === Number(id)) === -1)
        data[time.weekday].push({
          ...item,
          id: Number(id),
          schedules: schedules.sort(
            ({ time: a }, { time: b }) =>
              a.weekday - b.weekday || a.hour - b.hour || a.minute - b.minute,
          ),
        })
    }
  }

  return data.map((v, weekday) =>
    v.sort((a, b) => {
      const time_a = a.schedules.find((v) => v.time.weekday === weekday)!.time
      const time_b = b.schedules.find((v) => v.time.weekday === weekday)!.time
      return (
        time_a.weekday - time_b.weekday ||
        time_a.hour - time_b.hour ||
        time_a.minute - time_b.minute
      )
    }),
  )
}
