import { createClient } from '@supabase/supabase-js'

// Supabase configuration
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co'
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database helper functions

export async function createClient(clientData) {
  const { data, error } = await supabase
    .from('clients')
    .insert([
      {
        client_id: clientData.clientId,
        first_name: clientData.firstName,
        last_name: clientData.lastName,
        email: clientData.email,
        phone: clientData.phone,
        company: clientData.company,
        password_hash: clientData.passwordHash,
        status: 'trial', // trial → active after payment
        vps_ip: clientData.vpsIp,
        dashboard_url: clientData.dashboardUrl,
        created_at: new Date().toISOString(),
      }
    ])
    .select()

  if (error) throw error
  return data[0]
}

export async function getClientByEmail(email) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('email', email)
    .single()

  if (error && error.code !== 'PGRST116') throw error // PGRST116 = not found
  return data
}

export async function updateClientStatus(clientId, status) {
  const { data, error } = await supabase
    .from('clients')
    .update({ status, updated_at: new Date().toISOString() })
    .eq('client_id', clientId)
    .select()

  if (error) throw error
  return data[0]
}

export async function updateClientPayment(clientId, stripeData) {
  const { data, error } = await supabase
    .from('clients')
    .update({
      stripe_customer_id: stripeData.customerId,
      stripe_subscription_id: stripeData.subscriptionId,
      status: 'active',
      paid_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    })
    .eq('client_id', clientId)
    .select()

  if (error) throw error
  return data[0]
}

export async function getClientByStripeCustomerId(stripeCustomerId) {
  const { data, error } = await supabase
    .from('clients')
    .select('*')
    .eq('stripe_customer_id', stripeCustomerId)
    .single()

  if (error) throw error
  return data
}
