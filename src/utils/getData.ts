export const getAllDataName = () => {
  const dataFiles = import.meta.glob('../../db/data/*/*.json')
  const data: Record<string, string[]> = {}
  Object.keys(dataFiles).forEach((v) => {
    const [lang, name] = v.replace('../../db/data/', '').replace('.json', '').split('/')
    if (!data[lang]) data[lang] = []
    data[lang].push(name)
  })
  return data
}
export type Item = {
  title: {
    main: string
    jp: string
  }
  isContinue: boolean
  schedules: {
    time: string
    platform: {
      name: string
      url?: string
    }
    areas: string[] // code
  }[]
}
export type Items = Record<number, Item>
export const getAllData = async () => {
  const tmp = import.meta.glob('../../db/data/*/*.json', { eager: true, import: 'default' })
  const data: Record<string, Record<string, Items>> = {}

  for (const [i, v] of Object.entries(tmp)) {
    const [lang, name] = i.replace('../../db/data/', '').replace('.json', '').split('/')
    if (!data[lang]) data[lang] = {}
    data[lang][name] = v as Item
  }

  return data
}
