import { getApps, initializeApp, cert, type App } from 'firebase-admin/app'
import { getAuth, type Auth } from 'firebase-admin/auth'

let adminApp: App | undefined
let adminAuth: Auth | undefined

/** True when the Firebase Auth emulator is wired (local dev / CI). */
export function isAuthEmulator(): boolean {
  return Boolean(process.env.FIREBASE_AUTH_EMULATOR_HOST)
}

/**
 * Lazy, fail-closed Firebase Admin initialization.
 * - Emulator mode: projectId only, no service-account needed.
 * - Production: full service-account credentials REQUIRED; missing creds throw
 *   (no silent demo fallback — audit B10/D8).
 * Nothing initializes at module scope, so public pages render without creds.
 */
export function getFirebaseAdminApp(): App {
  if (!adminApp) {
    const existing = getApps().find((a) => a.name === 'lena-admin')
    if (existing) {
      adminApp = existing
      return adminApp
    }
    const projectId =
      process.env.FIREBASE_ADMIN_PROJECT_ID ||
      (isAuthEmulator() ? 'demo-lena' : undefined)
    const clientEmail = process.env.FIREBASE_ADMIN_CLIENT_EMAIL
    const privateKey = process.env.FIREBASE_ADMIN_PRIVATE_KEY?.replace(/\\n/g, '\n')

    if (isAuthEmulator()) {
      if (!projectId) throw new Error('FIREBASE_ADMIN_PROJECT_ID required for emulator mode')
      adminApp = initializeApp({ projectId }, 'lena-admin')
    } else if (projectId && clientEmail && privateKey) {
      adminApp = initializeApp(
        { credential: cert({ projectId, clientEmail, privateKey }), projectId },
        'lena-admin',
      )
    } else {
      throw new Error(
        'Firebase Admin is not configured. Set FIREBASE_ADMIN_PROJECT_ID/CLIENT_EMAIL/PRIVATE_KEY (production) or FIREBASE_AUTH_EMULATOR_HOST (local).',
      )
    }
  }
  return adminApp
}

export function getFirebaseAdminAuth(): Auth {
  if (!adminAuth) {
    adminAuth = getAuth(getFirebaseAdminApp())
  }
  return adminAuth
}

export const SESSION_COOKIE_NAME = 'lena_session'
export const SESSION_COOKIE_MAX_AGE = 5 * 24 * 60 * 60 // 5 days
