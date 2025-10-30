import Stripe from "stripe";
import { prisma } from "../../shared/prisma";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            const payment = await prisma.payment.updateMany({
                where: { stripeSession: session.id },
                data: { status: "paid" },
            });

            await prisma.appointment.updateMany({
                where: { payment: { stripeSession: session.id } },
                data: { status: "confirmed" },
            });

            console.log("✅ Payment completed, appointment confirmed.");
            break;
        }

        case "checkout.session.expired":
        case "payment_intent.payment_failed": {
            const session = event.data.object as any;

            await prisma.payment.updateMany({
                where: { stripeSession: session.id },
                data: { status: "failed" },
            });

            console.log("⚠️ Payment failed or expired.");
            break;
        }

        default:
            console.log(`⚙️ Unhandled event type: ${event.type}`);
    }
}

export const PaymentService = {
    handleStripeWebhookEvent
}