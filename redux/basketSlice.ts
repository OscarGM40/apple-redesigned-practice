import { createSlice } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import { Product } from "../interfaces/product";
import { RootState } from "./store";

export interface BasketState {
  items: Product[];
  total: number;
}

const initialState: BasketState = {
  items: [],
  total: 0,
};

export const basketSlice = createSlice({
  name: "basket",
  initialState,
  reducers: {
    addToBasket: (state: BasketState, action: PayloadAction<Product>) => {
      state.items = [...state.items, action.payload];
    },
    removeFromBasket: (state: BasketState, action: PayloadAction<{ id: string }>) => {
      const index = state.items.findIndex((item) => item._id === action.payload.id);
      if (index >= 0) {
        state.items.splice(index, 1);
      } else {
        console.log(`Can't remove product (id: ${action.payload.id}) as its not in the basket`);
      }
    },
  },
});

// hay que exportar todas las actions para poder usarlas
export const { addToBasket, removeFromBasket } = basketSlice.actions;

// selectors are quick accessors(just getters) By convention the name is selectXXX ??
export const selectBasketItems = (state: RootState) => state.basket.items;
export const selectBasketItemsWithSameId = (state: RootState, id: string) =>
  state.basket.items.filter((item) => item._id === id);
export const selectBasketTotal = (state: RootState) =>
  state.basket.items.reduce((total: number, item: Product) => {
    total += item.price;
    return total;
  }, 0);

// fijate que exportamos por default el reducer
export default basketSlice.reducer;
