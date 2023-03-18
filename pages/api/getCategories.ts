import type { NextApiRequest, NextApiResponse } from "next";
import { Category } from "../../interfaces/category";

import { groq } from "next-sanity";
// esto era la llamada a createClient(config) que configura el cliente
import { sanityClient } from "../../sanity";

const query = groq`*[_type == "category"] {
  _id,
  ...
}`;

type Data = {
  categories: Category[];
};

export default async function (req: NextApiRequest, res: NextApiResponse<Data>) {
  // sanityClient.fetch(query) acepta una query con sintaxis GROQ
  const categories = await sanityClient.fetch(query);
  res.status(200).json({ categories });
}
