import Stripe from "stripe";
import { prisma } from "../../shared/prisma";
import { PaymentStatus } from "@prisma/client";

const handleStripeWebhookEvent = async (event: Stripe.Event) => {
    switch (event.type) {
        case "checkout.session.completed": {
            const session = event.data.object as Stripe.Checkout.Session;

            const appointmentId = session.metadata?.appointmentId
            const paymentId = session.metadata?.paymentId

            await prisma.appointment.update({
                where: {
                    id: appointmentId
                },
                data: {
                    paymentStatus: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })

            await prisma.payment.update({
                where: {
                    id: paymentId
                },
                data: {
                    status: session.payment_status === 'paid' ? PaymentStatus.PAID : PaymentStatus.UNPAID
                }
            })


            console.log("✅ Payment completed, appointment confirmed.");
            console.log({ session });

            break;
        }

        case "checkout.session.expired":
        case "payment_intent.payment_failed": {
            const session = event.data.object as any;

            // await prisma.payment.updateMany({
            //     where: { stripeSession: session.id },
            //     data: { status: "failed" },
            // });

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