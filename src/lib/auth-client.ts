'use client'

import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  sendEmailVerification,
  sendPasswordResetEmail,
  applyActionCode,
  confirmPasswordReset,
  type Auth,
} from 'firebase/auth'
import { getFirebaseAuth } from '@/lib/firebase'

let auth: Auth | null = null
export function getClientAuth(): Auth {
  if (!auth) {
    auth = getFirebaseAuth()
  }
  return auth
}

export async function signUp(email: string, password: string) {
  const a = getClientAuth()
  const cred = await createUserWithEmailAndPassword(a, email, password)
  await sendEmailVerification(cred.user)
  return cred.user
}

export async function signIn(email: string, password: string) {
  const a = getClientAuth()
  const cred = await signInWithEmailAndPassword(a, email, password)
  return cred.user
}

export async function requestEmailVerification() {
  const a = getClientAuth()
  const user = a.currentUser
  if (!user) throw new Error('Not signed in')
  await sendEmailVerification(user)
}

export async function requestPasswordReset(email: string) {
  const a = getClientAuth()
  await sendPasswordResetEmail(a, email, {
    url: `${typeof window !== 'undefined' ? window.location.origin : ''}/verify`,
    handleCodeInApp: false,
  })
}

export async function verifyEmailCode(oobCode: string) {
  const a = getClientAuth()
  await applyActionCode(a, oobCode)
}

export async function resetPasswordConfirm(oobCode: string, newPassword: string) {
  const a = getClientAuth()
  await confirmPasswordReset(a, oobCode, newPassword)
}

export async function getIdToken(): Promise<string | null> {
  const a = getClientAuth()
  const user = a.currentUser
  if (!user) return null
  return user.getIdToken()
}

export async function signOut() {
  const a = getClientAuth()
  await a.signOut()
}
