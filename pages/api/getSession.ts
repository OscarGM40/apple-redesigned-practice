import type { NextApiRequest, NextApiResponse } from "next";
// clase Stripe
import Stripe from "stripe";
// instancia de Stripe que puede acceder a los métodos
const stripe: Stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

export default async function (req: NextApiRequest, res: NextApiResponse) {
  const sessionId = req.query.session_id as string;
  // este método listLineItems ya lo expone Stripe mediante una instancia de la clase,fijate que necesita una session para saber cuales mostrar
  const session = await stripe.checkout.sessions.listLineItems(sessionId);
  // devolvemos todo el objeto session(pero en session.data irán los productos que exponemos con el fetchLineItems)
  return res.status(200).json({
    session,
  });
}
