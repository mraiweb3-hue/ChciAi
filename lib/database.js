// Simple in-memory database (later replace with Supabase)
// For now: stores clients in memory, resets on server restart

const clients = new Map()

export async function createClient(clientData) {
  const { clientId, email, firstName, lastName, phone, company, passwordHash } = clientData
  
  // Check if email exists
  for (const [id, client] of clients.entries()) {
    if (client.email === email) {
      throw new Error('Email already registered')
    }
  }

  const now = new Date()
  const trialEndsAt = new Date(now.getTime() + 24 * 60 * 60 * 1000) // 24h from now

  // Assign port in valid range (9001-9999)
  const assignedPort = 9001 + clients.size
  
  const client = {
    clientId,
    email,
    firstName,
    lastName,
    phone,
    company,
    passwordHash,
    status: 'trial', // trial, active, expired, suspended
    trialStartedAt: now.toISOString(),
    trialEndsAt: trialEndsAt.toISOString(),
    openclawPort: assignedPort, // Port range: 9001-9999
    openclawUrl: `http://46.28.111.185:${assignedPort}`,
    createdAt: now.toISOString(),
    lastLogin: null,
    paidAt: null,
    stripeCustomerId: null,
    stripeSubscriptionId: null,
  }

  clients.set(clientId, client)
  console.log('✅ Client created:', { clientId, email, port: client.openclawPort })
  
  return client
}

export async function getClientByEmail(email) {
  for (const [id, client] of clients.entries()) {
    if (client.email === email) {
      return client
    }
  }
  return null
}

export async function getClientById(clientId) {
  return clients.get(clientId) || null
}

export async function updateClientStatus(clientId, status) {
  const client = clients.get(clientId)
  if (!client) throw new Error('Client not found')
  
  client.status = status
  client.updatedAt = new Date().toISOString()
  
  if (status === 'active') {
    client.paidAt = new Date().toISOString()
  }
  
  console.log(`✅ Client ${clientId} status updated:`, status)
  return client
}

export async function updateClientPayment(clientId, stripeData) {
  const client = clients.get(clientId)
  if (!client) throw new Error('Client not found')
  
  client.stripeCustomerId = stripeData.customerId
  client.stripeSubscriptionId = stripeData.subscriptionId
  client.status = 'active'
  client.paidAt = new Date().toISOString()
  client.updatedAt = new Date().toISOString()
  
  console.log(`✅ Client ${clientId} payment updated`)
  return client
}

export async function getAllClients() {
  return Array.from(clients.values())
}

export async function getExpiredTrials() {
  const now = new Date()
  const expired = []
  
  for (const [id, client] of clients.entries()) {
    if (client.status === 'trial' && new Date(client.trialEndsAt) < now) {
      expired.push(client)
    }
  }
  
  return expired
}

export async function getSoonExpiringTrials(hoursBeforeExpiry = 2) {
  const now = new Date()
  const threshold = new Date(now.getTime() + hoursBeforeExpiry * 60 * 60 * 1000)
  const expiring = []
  
  for (const [id, client] of clients.entries()) {
    const expiresAt = new Date(client.trialEndsAt)
    if (client.status === 'trial' && expiresAt < threshold && expiresAt > now) {
      expiring.push(client)
    }
  }
  
  return expiring
}

// Helper: Calculate remaining trial time
export function getRemainingTrialTime(client) {
  if (client.status !== 'trial') return null
  
  const now = new Date()
  const expiresAt = new Date(client.trialEndsAt)
  const msRemaining = expiresAt - now
  
  if (msRemaining <= 0) return { expired: true, hours: 0, minutes: 0 }
  
  const hours = Math.floor(msRemaining / (1000 * 60 * 60))
  const minutes = Math.floor((msRemaining % (1000 * 60 * 60)) / (1000 * 60))
  
  return { expired: false, hours, minutes }
}
