export const defaultLang = 'en'
export const languages = {
  en: 'English',
  'zh-hans': '简体中文',
}

export const ui: Record<keyof typeof languages, Record<string, string>> = {
  en: {
    catalog: 'Catalog',
    'catalog.back': 'Back To Catalog',
    'nav.weekday.all': 'All',
    'area.XA': 'Asia',
    'area.XN': 'Outside Asia',
    'area.XS': 'ASEAN',
    'area.XW': 'Worldwide',
    'area.XX': 'Unknown',
    'area.XL': 'Latin America',
    'table.cell.name': 'Name',
    'table.cell.time': 'Time',
    'table.cell.platform': 'Platform',
    continue: 'Continuing',
    licensor: 'Licensor',
  },
  'zh-hans': {
    catalog: '目录',
    'catalog.back': '返回目录',
    'nav.weekday.all': '全部',
    'area.XA': '亚洲',
    'area.XN': '亚洲以外',
    'area.XS': '东南亚',
    'area.XW': '全球',
    'area.XX': '未知',
    'area.XL': '拉美',
    'table.cell.name': '名称',
    'table.cell.time': '时间',
    'table.cell.platform': '平台',
    continue: '跨季连播',
    licensor: '授权方',
  },
} as const
