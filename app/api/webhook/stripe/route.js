import { NextResponse } from 'next/server'
import { updateClientStatus, updateClientPayment, getClientById } from '@/lib/database'

export async function POST(request) {
  try {
    const body = await request.text()
    const sig = request.headers.get('stripe-signature')

    // TODO: Uncomment when Stripe keys are added
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)
    
    let event
    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET
      )
    } catch (err) {
      console.error('❌ Webhook signature verification failed:', err.message)
      return NextResponse.json(
        { error: 'Invalid signature' },
        { status: 400 }
      )
    }

    console.log('✅ Stripe webhook received:', event.type)

    switch (event.type) {
      case 'checkout.session.completed': {
        const session = event.data.object
        const clientId = session.metadata.clientId || session.client_reference_id

        if (!clientId) {
          console.error('❌ No clientId in session metadata')
          break
        }

        const client = await getClientById(clientId)
        if (!client) {
          console.error('❌ Client not found:', clientId)
          break
        }

        // Update client with payment info
        await updateClientPayment(clientId, {
          customerId: session.customer,
          subscriptionId: session.subscription,
        })

        console.log('✅ Payment successful for client:', clientId)

        // TODO: Start OpenClaw container
        // await startOpenClawContainer(client)

        // TODO: Send activation email
        // await sendActivationEmail(client)

        break
      }

      case 'invoice.payment_succeeded': {
        // Recurring payment successful
        const invoice = event.data.object
        console.log('✅ Recurring payment succeeded:', invoice.customer)
        break
      }

      case 'invoice.payment_failed': {
        // Payment failed - suspend account
        const invoice = event.data.object
        const customerId = invoice.customer

        // Find client by Stripe customer ID
        // TODO: Implement getClientByStripeCustomerId
        console.log('❌ Payment failed for customer:', customerId)

        // TODO: Suspend OpenClaw container
        // TODO: Send payment failed email

        break
      }

      case 'customer.subscription.deleted': {
        // Subscription cancelled
        const subscription = event.data.object
        console.log('🔴 Subscription cancelled:', subscription.customer)

        // TODO: Stop OpenClaw container
        // TODO: Send cancellation confirmation email

        break
      }

      default:
        console.log('ℹ️ Unhandled event type:', event.type)
    }
    */

    // Placeholder until Stripe is configured
    console.log('📨 Stripe webhook endpoint ready (waiting for Stripe keys)')

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('Webhook error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}
