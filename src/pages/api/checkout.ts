import { stripe } from "@/lib/stripe";
import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse){
    const checkoutData = req.body.checkoutData;

    if(req.method !== 'POST'){
        return res.status(405).json({error: 'Method not allowed.'})
    }

    if(!checkoutData){
        return res.status(400).json({error: 'Price not found.'})
    }

    const successUrl = `${process.env.NEXT_URL}/success/?session_id={CHECKOUT_SESSION_ID}`
    const cancelUrl = `${process.env.NEXT_URL}/`


    try {
        const checkoutSession = await stripe.checkout.sessions.create({
            success_url: successUrl,
            cancel_url: cancelUrl,
            mode: "payment",
            line_items: checkoutData.line_items
        })


        return res.status(201).json({
            checkoutUrl: checkoutSession.url,
        })
    } catch (e) {
        console.log("erro:", e);
    }
} 