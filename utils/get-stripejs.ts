/**
 * This is a singleton to ensure we only instantiate Stripe once.
 * Fijate que lo importante es asegurar que loadStripe devuelve lo mismo y como creo una funcion wrapper que retorne la propiedad 
 */
import { Stripe, loadStripe } from "@stripe/stripe-js";
// TIP:fijate que puedo devolver la misma promesa,en este caso es lo que hacemos,nunca habia pensado que podemos devolver una Promise en singleton
let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

export default getStripe;

let property:string | null;

export const getSameProperty = () => {
  if(!property){
    property = "casa";
  }
  return property; // este string solo se va a crear una vez.Amazing spiderman
}