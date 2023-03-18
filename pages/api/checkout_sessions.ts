import type { NextApiRequest, NextApiResponse } from "next";
import Stripe from "stripe";
import { Product } from "../../interfaces/product";
import { urlFor } from "../../sanity";

// instanciamos stripe con nuestra private key
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2022-11-15",
});

export default async function (req: NextApiRequest, res: NextApiResponse) {
  if (req.method === "POST") {
    // fijate que los items nos llegan en req.body.items
    const items: Product[] = req.body.items;

    // Stripe espera los items de una forma concreta,hay que mapear los items
    const transformedItems = items.map((item) => ({
      price_data: {
        currency: "usd",
        product_data: {
          name: item.title,
          images: [urlFor(item.image[0]).url()],
        },
        // normalmente se multiplicara por 100 para que no sean centavos
        // minimo son 50 centavos.PArece que ademas da igual esto porque solo cobra enteros(3 dolares,4 dolares,etc nunca con decimales)
        unit_amount: Math.round(item.price * 100),
      },
      quantity: 1,
    }));

    try {
      // creamos los params a mandar
      const params: Stripe.Checkout.SessionCreateParams = {
        payment_method_types: ["card"],
        // puedo restringir los paises de envio
        /* shipping_address_collection:{
          allowed_countries:["US","CA"]
        }, */
        line_items: transformedItems,
        payment_intent_data: {},
        mode: "payment",
        // esto podemos hacerlo al haberlo expuesto en el checkout,parece que el queryParam es opcional pero es mejor hacerlo asi
        success_url: `${req.headers.origin}/success?session_id={CHECKOUT_SESSION_ID}`,
        // fijate que es de donde venimos
        cancel_url: `${req.headers.origin}/checkout`,
        metadata: {
          images: JSON.stringify(items.map((item) => item.image[0].asset.url)),
        },
      };
      // creamos la checkout session usando el id del body(ojo que es una Promise) y con los params para cada pago
      const checkoutSession: Stripe.Checkout.Session = await stripe.checkout.sessions.create(
        params,
      );
      // hay que devolver esa sesion en el response.json()
      res.status(200).json(checkoutSession);
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : "Internal server error";
      return res.status(500).json({ statusCode: 500, message: errorMessage });
    }
  } else {
    // esto lo recomienda Stripe,pero a saber
    res.setHeader("Allow", "POST");
    res.status(405).end("Method Not Allowed");
  }
}
