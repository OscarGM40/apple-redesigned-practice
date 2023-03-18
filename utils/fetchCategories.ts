import { Category } from "../interfaces/category";

export const fetchCategories = async () => {
  // fijate que apuntamos a un endpoint interno
  const res = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/getCategories`);
  const data = await res.json();
  // muy osado esto jeje
  const categories: Category[] = data?.categories;
  return categories;
};
