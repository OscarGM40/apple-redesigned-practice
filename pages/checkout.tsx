import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import Button from "../components/Button";
import CheckoutProduct from "../components/CheckoutProduct";
import Header from "../components/Header";
import { Product } from "../interfaces/product";
import { selectBasketItems, selectBasketTotal } from "../redux/basketSlice";
import { groupByOneKey } from "../utils/customGroupBy";
import Currency from "react-currency-formatter";
import { ChevronDownIcon } from "@heroicons/react/outline";
import { Stripe } from "stripe";
import { fetchPostJSON } from "../utils/api-helpers";
import getStripe from "../utils/get-stripejs";

const Checkout: NextPage = () => {
  // fijate en el uso de los getters,que fácil,asinto
  const items = useSelector(selectBasketItems);
  // fijate que se le pasa el getter al useSelector,de nuevo,idiota
  const basketTotal = useSelector(selectBasketTotal);
  const router = useRouter();

  // fijate como tipamos el default object que va a ser de tipo [key:string]:Product[]
  // esto es igual que el record,solo que aqui no sé las keys,en el Record las sabia
  const [groupedItemsInBasket, setGroupedItemsInBasket] = useState(
    {} as { [key: string]: Product[] },
  );
  const [loading, setLoading] = useState(false);

  const createCheckoutSession = async () => {
    setLoading(true);

    // lo primero es crear/abrir una session en Stripe
    const checkoutSession: Stripe.Checkout.Session = await fetchPostJSON("/api/checkout_sessions", {
      items: items,
    });
    // si da un 500 imprimimos el log y paramos
    if ((checkoutSession as any).statusCode === 500) {
      return console.error((checkoutSession as any).message);
    }
    // si no redirigimos a su API,concretamente a checkout.
    // Lo primero es recuperar la instancia de stripe(en Singleton) mediante el helper
    const stripe = await getStripe();
    // despues tratamos de redirigir a su API con el id de session
    const { error } = await stripe!.redirectToCheckout({
      // Make the id field from the Checkout Session creation API response
      // available to this file, so you can provide it as parameter here
      // instead of the {{CHECKOUT_SESSION_ID}} placeholder.
      sessionId: checkoutSession.id,
    });
    // si el redirect fallará error no sería undefined y se imprimirá este console.warn
    console.warn(error.message);

    setLoading(false)
  };

  useEffect(() => {
    // another form(fijate que me deja como key el _id)
    const groupedItems = items.reduce((results, item) => {
      // si existe la key en el object le haces push al arreglo con el siguiente item, si no creas uno vacio y metes el item
      (results[item._id] = results[item._id] || []).push(item);
      return results;
    }, {} as { [key: string]: Product[] });
    // ojo que el id me vale para ordenar, lo comparten todos
    setGroupedItemsInBasket(groupByOneKey(items, "_id"));
  }, [items]);

  return (
    <div className="min-h-screen overflow-hidden bg-[#e7ecee]">
      <Head>
        <title>Bag - Apple</title>
        <link rel="icon" href="/images/iphone.png" />
      </Head>
      <Header />
      <main className="mx-auto max-w-5xl pb-24">
        <div className="px-5">
          <h1 className="my-4 text-3xl font-semibold lg:text-4xl">
            {items.length > 0 ? "Review your bag." : "Your bag is empty."}
          </h1>
          <p className="my-4">Free delivery and free returns.</p>
          {items.length === 0 && (
            <Button title="Continue Shopping" onClick={() => router.push("/")} />
          )}
        </div>
        {items.length > 0 && (
          <div className="mx-5 md:mx-8">
            {Object.entries(groupedItemsInBasket).map(([key, items]) => (
              <CheckoutProduct key={key} items={items} id={key} />
            ))}
            <div className="my-12 mt-6 ml-auto max-w-3xl">
              <div className="divide-y divide-gray-300 pb-4">
                {/* RESUMEN PAGO */}
                <div className="pb-4">
                  <div className="flex justify-between ">
                    <p>Subtotal</p>
                    <p>
                      <Currency quantity={basketTotal} currency="USD" />
                    </p>
                  </div>
                  <div className="flex justify-between">
                    <p>Shipping</p>
                    <p>FREE</p>
                  </div>
                  <div className="flex justify-between">
                    <div className="flex flex-col gap-x-1 lg:flex-row">
                      Estimated tax for:
                      <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
                        Enter zip code
                        <ChevronDownIcon className="h-6 w-6" />
                      </p>
                    </div>
                    <p>$ -</p>
                  </div>
                </div>
                {/* TOTAL */}
                <div className="flex justify-between pt-4 text-xl font-semibold">
                  <h4>Total</h4>
                  <h4>
                    <Currency quantity={basketTotal} currency="USD" />
                  </h4>
                </div>
              </div>
              {/* CARDS */}
              <div className="my-11 space-y-4">
                <h4 className="text-xl font-semibold">How would you like to check out?</h4>
                <div className="flex flex-col gap-4 md:flex-row">
                  {/* first card */}
                  <div className="order-2 flex flex-1 flex-col items-center rounded-xl bg-gray-200 p-8 py-12 text-center">
                    <h4 className="mb-4 flex flex-col text-xl font-semibold">
                      <span>Pay Monthly</span>
                      <span>with Apple Card</span>
                      <span>
                        $283.16/mo at 0% APR<sup className="-top-1">◊</sup>
                      </span>
                    </h4>
                    <Button title="Check Out with Apple Card Monthly Installments" />
                    <p className="mt-2 max-w-[240px] text-[13px]">
                      $0.00 due today, wich includes applicable full-price items, down payments,
                      shipping and taxes.
                    </p>
                  </div>

                  {/* second card */}
                  <div className="flex flex-1 flex-col items-center space-y-8 rounded-xl bg-gray-200 p-8 py-12 md:order-2">
                    <h4 className="mb-4 flex flex-col text-xl font-semibold">
                      Pay in full
                      <span>
                        <Currency quantity={basketTotal} currency="USD" />
                      </span>
                    </h4>
                    <Button
                      noIcon
                      loading={loading}
                      title="Check Out"
                      width="w-full"
                      onClick={createCheckoutSession}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
export default Checkout;
