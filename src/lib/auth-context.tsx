"use client"

import { createContext, useContext, useEffect, useState, ReactNode } from 'react'
import { 
  User, 
  signInWithEmailAndPassword, 
  signInWithPopup,
  GoogleAuthProvider,
  signOut as firebaseSignOut,
  onAuthStateChanged 
} from 'firebase/auth'
import { doc, getDoc, setDoc } from 'firebase/firestore'
import { auth, db } from './firebase'

export interface UserProfile {
  email: string
  name: string
  phone?: string
  address?: {
    street: string
    city: string
    postalCode: string
  }
  acceptMarketing?: boolean
  profileComplete?: boolean
  createdAt: string
  updatedAt?: string
}

interface AuthContextType {
  user: User | null
  userProfile: UserProfile | null
  isAdmin: boolean
  loading: boolean
  isProfileComplete: boolean
  signIn: (email: string, password: string) => Promise<void>
  signInWithGoogle: () => Promise<{ isNewUser: boolean }>
  signOut: () => Promise<void>
  refreshUserProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

const googleProvider = new GoogleAuthProvider()

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [userProfile, setUserProfile] = useState<UserProfile | null>(null)
  const [isAdmin, setIsAdmin] = useState(false)
  const [loading, setLoading] = useState(true)
  const [isProfileComplete, setIsProfileComplete] = useState(false)

  const fetchUserProfile = async (userId: string) => {
    const userDoc = await getDoc(doc(db, 'users', userId))
    if (userDoc.exists()) {
      const data = userDoc.data() as UserProfile
      setUserProfile(data)
      setIsProfileComplete(data.profileComplete === true)
      return data
    }
    return null
  }

  const refreshUserProfile = async () => {
    if (user) {
      await fetchUserProfile(user.uid)
    }
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setUser(user)
      
      if (user) {
        // Check if user is admin
        try {
          const adminDoc = await getDoc(doc(db, 'admins', user.uid))
          setIsAdmin(adminDoc.exists())
        } catch {
          setIsAdmin(false)
        }
        
        // Fetch user profile
        await fetchUserProfile(user.uid)
      } else {
        setIsAdmin(false)
        setUserProfile(null)
        setIsProfileComplete(false)
      }
      
      setLoading(false)
    })

    return () => unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await signInWithEmailAndPassword(auth, email, password)
  }

  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider)
    const user = result.user
    
    // Check if user profile exists
    const userDoc = await getDoc(doc(db, 'users', user.uid))
    const isNewUser = !userDoc.exists()
    
    if (isNewUser) {
      // Create basic profile, marked as incomplete
      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        name: user.displayName || '',
        profileComplete: false,
        createdAt: new Date().toISOString(),
      })
    }
    
    return { isNewUser }
  }

  const signOut = async () => {
    await firebaseSignOut(auth)
    setIsAdmin(false)
    setUserProfile(null)
    setIsProfileComplete(false)
  }

  return (
    <AuthContext.Provider value={{ 
      user, 
      userProfile,
      isAdmin, 
      loading, 
      isProfileComplete,
      signIn, 
      signInWithGoogle, 
      signOut,
      refreshUserProfile
    }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
