import type { GetServerSideProps, NextPage } from "next";
import Head from "next/head";
import Header from "../components/Header";
import Landing from "../components/Landing";
import { Tab } from "@headlessui/react";
import { fetchCategories } from "../utils/fetchCategories";
import { Category } from "../interfaces/category";
import { fetchProducts } from "../utils/fetchProducts";
import { Product } from "../interfaces/product";
import ProductCard from "../components/Product";
import Basket from "../components/Basket";

interface Props {
  categories: Category[];
  products: Product[];
}
const Home: NextPage<Props> = ({ categories, products }) => {
  // console.log({ categories });
  // console.log({ products });

  /**
   * @param category numero de categoria
   * @returns todas las Cards de Productos de esa categoria
   */
  const showProducts = (category: number) => {
    // filter products by category
    return products
      .filter((product) => product.category._ref === categories[category]._id)
      .map((product) => <ProductCard product={product} key={product._id} />);
  };

  return (
    <div className="">
      <Head>
        <title>Apple Redesign</title>
        <link rel="icon" href="/images/iphone.png" />
      </Head>
      <Header />
      <Basket />
      <main className="relative h-[200vh] bg-[#e7ecee]">
        <Landing />
      </main>
      <section className="relative z-40 -mt-[100vh] min-h-screen bg-[#1b1b1b]">
        <div className="space-y-10 py-16">
          <h1 className="text-center text-4xl font-medium tracking-wide text-white md:text-5xl">
            New Promos
          </h1>
          <Tab.Group>
            <Tab.List className="flex justify-center">
              {categories.map((category) => (
                <Tab
                  key={category._id}
                  id={category._id}
                  className={({ selected }) =>
                    `whitespace-nowrap rounded-t-lg py-3 px-5 text-sm font-light outline-none md:py-4 md:px-6 md:text-base ${
                      selected
                        ? "borderGradient bg-[#35383C] text-white"
                        : "border-b-2 border-[#35383C] text-[#747474]"
                    }`
                  }
                >
                  {category.title}
                </Tab>
              ))}
            </Tab.List>
            <Tab.Panels className="mx-auto max-w-fit pt-10 pb-24 sm:px-4">
              <Tab.Panel className="tabPanel">{showProducts(0)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(1)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(2)}</Tab.Panel>
              <Tab.Panel className="tabPanel">{showProducts(3)}</Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </section>
    </div>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps<Props> = async () => {
  //  si usa fetch todo esta funcion tiene que estar en el browser.Por eso tengo visión sobre fetch,porque es el browser este scope(y por lo mismo la env es del tipo browser y necesita NEXT_PUBLIC_...)
  const [categories, products] = await Promise.all([
    await fetchCategories(),
    await fetchProducts(),
  ]);

  return {
    // typing === props: {}
    props: {
      categories,
      products,
    },
  };
};
