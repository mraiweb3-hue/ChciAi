import { NextResponse } from 'next/server'
import { getClientByEmail } from '@/lib/database'

export async function POST(request) {
  try {
    const { email, includeAcademy } = await request.json()

    if (!email) {
      return NextResponse.json(
        { error: 'Email je povinný' },
        { status: 400 }
      )
    }

    const client = await getClientByEmail(email)
    if (!client) {
      return NextResponse.json(
        { error: 'Klient nenalezen' },
        { status: 404 }
      )
    }

    // TODO: Uncomment when Stripe keys are added
    /*
    const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY)

    const lineItems = [
      {
        price_data: {
          currency: 'czk',
          product_data: {
            name: 'OpenClaw Hosting',
            description: 'Český VPS + 24/7 AI podpora + osobní pomoc',
          },
          recurring: {
            interval: 'month',
          },
          unit_amount: 49900, // 499 Kč
        },
        quantity: 1,
      },
    ]

    if (includeAcademy) {
      lineItems.push({
        price_data: {
          currency: 'czk',
          product_data: {
            name: 'VibeCooding Academy',
            description: 'Kurzy, videa, šablony, komunita',
          },
          unit_amount: 34900, // 349 Kč (one-time)
        },
        quantity: 1,
      })
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items: lineItems,
      mode: 'subscription',
      success_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard?payment=success`,
      cancel_url: `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/install?payment=cancelled`,
      client_reference_id: client.clientId,
      customer_email: client.email,
      metadata: {
        clientId: client.clientId,
        includeAcademy: includeAcademy ? 'yes' : 'no',
      },
    })

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      url: session.url,
    })
    */

    // Placeholder response until Stripe keys are added
    console.log('💳 Stripe checkout requested for:', email)
    console.log('   Include Academy:', includeAcademy)
    console.log('   Total:', includeAcademy ? '848 Kč' : '499 Kč')

    return NextResponse.json({
      success: true,
      message: 'Stripe integrace připravena. Přidejte Stripe keys do .env',
      mockCheckout: true,
      // For testing, we'll simulate successful payment
      url: '/dashboard?payment=success&mock=true',
    })

  } catch (error) {
    console.error('Checkout error:', error)
    return NextResponse.json(
      { error: 'Chyba při vytváření platby' },
      { status: 500 }
    )
  }
}
