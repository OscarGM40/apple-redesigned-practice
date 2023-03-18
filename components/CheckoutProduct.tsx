import { ChevronDownIcon } from "@heroicons/react/outline";
import Image from "next/image";
import { Product } from "../interfaces/product";
import { urlFor } from "../sanity";
import Currency from "react-currency-formatter";
import { useDispatch } from "react-redux";
import { removeFromBasket } from "../redux/basketSlice";
import { toast } from "react-hot-toast";

interface Props {
  items: Product[];
  id: string;
}
const CheckoutProduct = ({ items, id }: Props) => {
  const dispatch = useDispatch();

  // no pasamos el id porque los productos lo comparten en Sanity,pero fijate que normalmente lo deberia recibir la función
  const removeItemFromBasket = () => {
    dispatch(removeFromBasket({ id }));
    toast.error(`${items[0].title} removed from basket`, {
      position: "bottom-center",
    });
  };

  return (
    <div className="flex flex-col gap-x-4 border-b border-gray-300 pb-5 lg:flex-row lg:items-center">
      <div className="relative h-44 w-44">
        {/* me vale el primero ya que son todos el mismo producto */}
        <Image
          // fijate que aqui cambia el tipo de comentario a JS,entre componentes es el de React,asinto
          src={urlFor(items[0].image[0]).url()}
          alt="product-img"
          fill
          style={{ objectFit: "contain" }}
        />
      </div>
      <div className="flex flex-1 items-end lg:items-center">
        <div className="flex-1 space-y-4">
          <div className="flex flex-col gap-x-8 text-xl lg:flex-row lg:text-2xl">
            <h4 className="font-semibold lg:w-96">{items[0].title}</h4>
            <p className="flex items-end gap-x-1 font-semibold">
              {items.length}
              <ChevronDownIcon className="h-6 w-6 text-blue-500" />
            </p>
          </div>
          <p className="flex cursor-pointer items-end text-blue-500 hover:underline">
            Show product details
            <ChevronDownIcon className="h-6 w-6 " />
          </p>
        </div>

        <div className="flex flex-col items-end space-y-4">
          <h4 className="text-xl font-semibold lg:text-2xl">
            <Currency
              quantity={items.reduce((total, item) => (total += item.price), 0)}
              currency="USD"
            />
          </h4>
          <button onClick={removeItemFromBasket} className="text-blue-500 hover:underline">
            Remove
          </button>
        </div>
      </div>
    </div>
  );
};
export default CheckoutProduct;
