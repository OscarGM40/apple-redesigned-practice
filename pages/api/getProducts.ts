import type { NextApiRequest, NextApiResponse } from "next";
import { groq } from "next-sanity";
import { Product } from "../../interfaces/product";
import { sanityClient } from "../../sanity";

const query = groq`*[_type == "product"] {
  _id,
  ...
} | order(_createdAt asc)`;

type Data = {
  products: Product[];
};

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  const products = await sanityClient.fetch(query);
  res.status(200).json({ products });
}
