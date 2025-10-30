import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import { PaymentService } from "./payment.service";
import Stripe from "stripe";
import { stripe } from "../../helper/stripe";

const handleStripeWebhookEvent = catchAsync(async (req: Request, res: Response) => {
    // const user = req.user;

    const sig = req.headers["stripe-signature"];
    const webhookSecret = ""

    if (!sig) {
        return res.status(400).send("Missing Stripe signature header");
    }

    let event: Stripe.Event;

    try {
        event = stripe.webhooks.constructEvent(
            req.body,
            sig,
            // process.env.STRIPE_WEBHOOK_SECRET!
            webhookSecret
        );
    } catch (err: any) {
        console.error("❌ Invalid Stripe signature:", err.message);
        return res.status(400).send(`Webhook Error: ${err.message}`);
    }

    const result = await PaymentService.handleStripeWebhookEvent(event);

    sendResponse(res, {
        statusCode: 201,
        success: true,
        message: "Webhook request send successfully!",
        data: result
    })
});

export const PaymentController = {
    handleStripeWebhookEvent
}
