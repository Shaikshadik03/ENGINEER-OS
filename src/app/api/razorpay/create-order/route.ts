import { NextRequest, NextResponse } from 'next/server'
import Razorpay from 'razorpay'

export async function POST(request: NextRequest) {
  try {
    const { plan } = await request.json()

    // Amount in paise (1 INR = 100 paise)
    const amount = plan === 'annual' ? 149900 : 19900

    const key_id = process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 'rzp_test_placeholder'
    const key_secret = process.env.RAZORPAY_KEY_SECRET || 'rzp_secret_placeholder'

    // If real keys are provided, use Razorpay SDK
    if (process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID && process.env.RAZORPAY_KEY_SECRET) {
      const razorpay = new Razorpay({ key_id, key_secret })
      const order = await razorpay.orders.create({
        amount,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
      })
      return NextResponse.json({
        orderId: order.id,
        amount: order.amount,
        currency: order.currency,
        keyId: key_id
      })
    }

    // Demo/Sandbox Fallback order for instant testing
    const demoOrderId = `order_demo_${Date.now()}`
    return NextResponse.json({
      orderId: demoOrderId,
      amount,
      currency: 'INR',
      keyId: 'rzp_test_demo',
      isDemo: true
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}
