// Simple session management (localStorage based)
// In production, use JWT tokens or NextAuth

export function saveSession(clientData) {
  if (typeof window === 'undefined') return
  
  localStorage.setItem('chciai_session', JSON.stringify({
    email: clientData.email,
    clientId: clientData.clientId,
    firstName: clientData.firstName,
    lastName: clientData.lastName,
  }))
}

export function getSession() {
  if (typeof window === 'undefined') return null
  
  const data = localStorage.getItem('chciai_session')
  return data ? JSON.parse(data) : null
}

export function clearSession() {
  if (typeof window === 'undefined') return
  
  localStorage.removeItem('chciai_session')
}

export function isAuthenticated() {
  return getSession() !== null
}
