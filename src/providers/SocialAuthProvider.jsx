import { createContext, useContext, useState } from 'react'
// import { Auth0Provider } from '@auth0/auth0-react' // Commented out - causing loading issues

const SocialAuthContext = createContext({})

export const useSocialAuth = () => useContext(SocialAuthContext)

export function SocialAuthProvider({ children }) {
  const [farcasterUser, setFarcasterUser] = useState(null)
  const [twitterUser, setTwitterUser] = useState(null)

  // Farcaster Auth using @farcaster/auth-kit
  const connectFarcaster = async () => {
    try {
      // This would integrate with @farcaster/auth-kit
      // For now, we'll just simulate the connection
      console.log('Connecting to Farcaster...')
      // const authClient = new AuthClient()
      // const result = await authClient.authenticate()
      // setFarcasterUser(result.user)
      
      // Simulated user data
      setFarcasterUser({
        fid: '12345',
        username: 'researcher',
        displayName: 'koH Labs Researcher',
        pfp: 'https://api.faviconkit.com/farcaster.xyz/144'
      })
      
      return true
    } catch (error) {
      console.error('Farcaster auth error:', error)
      return false
    }
  }

  const disconnectFarcaster = () => {
    setFarcasterUser(null)
  }

  // Twitter Auth (would integrate with Auth0 or Twitter API)
  const connectTwitter = async () => {
    try {
      console.log('Connecting to Twitter...')
      // This would integrate with Auth0 or Twitter OAuth
      
      // Simulated user data
      setTwitterUser({
        id: '67890',
        username: 'kohlabs_researcher',
        displayName: 'koH Labs',
        avatar: 'https://api.faviconkit.com/twitter.com/144'
      })
      
      return true
    } catch (error) {
      console.error('Twitter auth error:', error)
      return false
    }
  }

  const disconnectTwitter = () => {
    setTwitterUser(null)
  }

  const value = {
    // Farcaster
    farcasterUser,
    connectFarcaster,
    disconnectFarcaster,
    isFarcasterConnected: !!farcasterUser,
    
    // Twitter
    twitterUser,
    connectTwitter,
    disconnectTwitter,
    isTwitterConnected: !!twitterUser,
  }

  // Auth0 integration temporarily disabled - was causing loading issues
  // const auth0Domain = import.meta.env.VITE_AUTH0_DOMAIN
  // const auth0ClientId = import.meta.env.VITE_AUTH0_CLIENT_ID

  // if (auth0Domain && auth0ClientId) {
  //   return (
  //     <Auth0Provider
  //       domain={auth0Domain}
  //       clientId={auth0ClientId}
  //       authorizationParams={{
  //         redirect_uri: window.location.origin
  //       }}
  //     >
  //       <SocialAuthContext.Provider value={value}>
  //         {children}
  //       </SocialAuthContext.Provider>
  //     </Auth0Provider>
  //   )
  // }

  return (
    <SocialAuthContext.Provider value={value}>
      {children}
    </SocialAuthContext.Provider>
  )
}