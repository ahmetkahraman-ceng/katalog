import fs from 'fs'
import path from 'path'
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from './site-settings-constants'

export * from './site-settings-constants'

const SETTINGS_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'site-settings.json')

export function getSiteSettings(): SiteSettings {
  try {
    if (fs.existsSync(SETTINGS_FILE_PATH)) {
      const data = fs.readFileSync(SETTINGS_FILE_PATH, 'utf-8')
      const parsed = JSON.parse(data)
      return {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        announcement: { ...DEFAULT_SITE_SETTINGS.announcement, ...parsed.announcement },
        hero: { ...DEFAULT_SITE_SETTINGS.hero, ...parsed.hero },
        atelier: { ...DEFAULT_SITE_SETTINGS.atelier, ...parsed.atelier },
      }
    }
  } catch (error) {
    console.error('Error reading site settings:', error)
  }
  return DEFAULT_SITE_SETTINGS
}

export function updateSiteSettings(partial: Partial<SiteSettings>): SiteSettings {
  try {
    const current = getSiteSettings()
    const updated: SiteSettings = {
      ...current,
      ...partial,
      announcement: { ...current.announcement, ...(partial.announcement || {}) },
      hero: { ...current.hero, ...(partial.hero || {}) },
      atelier: { ...current.atelier, ...(partial.atelier || {}) },
    }

    const dir = path.dirname(SETTINGS_FILE_PATH)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }

    fs.writeFileSync(SETTINGS_FILE_PATH, JSON.stringify(updated, null, 2), 'utf-8')
    return updated
  } catch (error) {
    console.error('Error writing site settings:', error)
    return getSiteSettings()
  }
}
