import { createContext, ReactNode, useContext, useState } from 'react';
import { toast } from 'react-toastify';
import { api } from '../services/api';
import { Product } from '../types';

interface CartProviderProps {
  children: ReactNode;
}

interface UpdateProductAmount {
  productId: number;
  amount: number;
}

interface CartContextData {
  cart: Product[];
  addProduct: (productId: number) => Promise<void>;
  removeProduct: (productId: number) => void;
  updateProductAmount: ({ productId, amount }: UpdateProductAmount) => void;
}

const CartContext = createContext<CartContextData>({} as CartContextData);

export function CartProvider({ children }: CartProviderProps): JSX.Element {
  const [cart, setCart] = useState<Product[]>(() => {
    // const storagedCart = Buscar dados do localStorage

    // if (storagedCart) {
    //   return JSON.parse(storagedCart);
    // }

    return [];
  });

  console.log('carrinho', cart)

  // Adicionar um produto ao carrinho X//
  const addProduct = async (productId: number) => {
    try {
      let productResponse = await api.get(`/products/${productId}`);
      const stockResponse = await api.get(`stock/${productId}`);
      const stockLimit = stockResponse.data.amount;

      productResponse.data = {
        ...productResponse.data,
        amount: 1,
        stockLimit
      }

      setCart([...cart, productResponse.data]);

    } catch {
      // TODO
    }
  };


  //Remover um produto do carrinho X//
  const removeProduct = (productId: number) => {
    try {

      const newCart = cart.filter(product => product.id !== productId);
      setCart(newCart);

    } catch {
      // TODO
    }
  };

  // Atualizar o estoque de um produto no carrinho X//
  const updateProductAmount = async ({
    productId,
    amount,
  }: UpdateProductAmount) => {
    try {

      const response = await api.get(`stock/${productId}`);
      const totalAmount = response.data.amount;

      const hasStock = totalAmount >= amount;

      if (hasStock) {
        const newCart = cart.map(product => product.id === productId ? {
          ...product,
          amount: amount
        } : product);

        setCart(newCart);

      } else {
        console.log('sem estoque')
      }

    } catch {
      // TODO
    }
  };

  return (
    <CartContext.Provider
      value={{ cart, addProduct, removeProduct, updateProductAmount }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart(): CartContextData {
  const context = useContext(CartContext);

  return context;
}
