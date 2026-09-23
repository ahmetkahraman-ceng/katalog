import fs from 'fs'
import path from 'path'
import os from 'os'
import {
  SiteSettings,
  DEFAULT_SITE_SETTINGS,
} from './site-settings-constants'

export * from './site-settings-constants'

// Global in-memory instance to persist across serverless invocations within the warm container
const globalWithSettings = globalThis as unknown as {
  __ACTIVE_SITE_SETTINGS__?: SiteSettings
}

const LOCAL_SETTINGS_FILE = path.join(process.cwd(), 'src', 'data', 'site-settings.json')
const TMP_SETTINGS_FILE = path.join(os.tmpdir(), 'site-settings.json')

export function getSiteSettings(): SiteSettings {
  // 1. Return in-memory cached settings if available
  if (globalWithSettings.__ACTIVE_SITE_SETTINGS__) {
    return globalWithSettings.__ACTIVE_SITE_SETTINGS__
  }

  // 2. Try reading from /tmp/site-settings.json (writable on Vercel AWS Lambda)
  try {
    if (fs.existsSync(TMP_SETTINGS_FILE)) {
      const data = fs.readFileSync(TMP_SETTINGS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        announcement: { ...DEFAULT_SITE_SETTINGS.announcement, ...(parsed.announcement || {}) },
        hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(parsed.hero || {}) },
        atelier: { ...DEFAULT_SITE_SETTINGS.atelier, ...(parsed.atelier || {}) },
      }
      globalWithSettings.__ACTIVE_SITE_SETTINGS__ = merged
      return merged
    }
  } catch (error) {
    console.warn('Could not read from tmp settings file:', error)
  }

  // 3. Try reading from local project path (for development)
  try {
    if (fs.existsSync(LOCAL_SETTINGS_FILE)) {
      const data = fs.readFileSync(LOCAL_SETTINGS_FILE, 'utf-8')
      const parsed = JSON.parse(data)
      const merged: SiteSettings = {
        ...DEFAULT_SITE_SETTINGS,
        ...parsed,
        announcement: { ...DEFAULT_SITE_SETTINGS.announcement, ...(parsed.announcement || {}) },
        hero: { ...DEFAULT_SITE_SETTINGS.hero, ...(parsed.hero || {}) },
        atelier: { ...DEFAULT_SITE_SETTINGS.atelier, ...(parsed.atelier || {}) },
      }
      globalWithSettings.__ACTIVE_SITE_SETTINGS__ = merged
      return merged
    }
  } catch (error) {
    console.warn('Could not read from local settings file:', error)
  }

  // 4. Fallback to default constants
  globalWithSettings.__ACTIVE_SITE_SETTINGS__ = DEFAULT_SITE_SETTINGS
  return DEFAULT_SITE_SETTINGS
}

export function updateSiteSettings(partial: Partial<SiteSettings>): SiteSettings {
  const current = getSiteSettings()
  const updated: SiteSettings = {
    ...current,
    ...partial,
    announcement: { ...current.announcement, ...(partial.announcement || {}) },
    hero: { ...current.hero, ...(partial.hero || {}) },
    atelier: { ...current.atelier, ...(partial.atelier || {}) },
  }

  // ALWAYS update in-memory state FIRST so all subsequent reads are instant and guaranteed
  globalWithSettings.__ACTIVE_SITE_SETTINGS__ = updated

  // ALWAYS write to /tmp (fully writable on Vercel serverless environment)
  try {
    fs.writeFileSync(TMP_SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch (error) {
    console.warn('Failed writing settings to tmpdir:', error)
  }

  // Attempt writing to local project directory (safely ignored if Vercel read-only filesystem)
  try {
    const dir = path.dirname(LOCAL_SETTINGS_FILE)
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true })
    }
    fs.writeFileSync(LOCAL_SETTINGS_FILE, JSON.stringify(updated, null, 2), 'utf-8')
  } catch {
    // Expected on Vercel serverless read-only filesystem (/var/task). Safely ignored.
  }

  return updated
}
