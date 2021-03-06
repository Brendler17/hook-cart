import React, { useState, useEffect } from 'react';
import { MdAddShoppingCart } from 'react-icons/md';

import { ProductList } from './styles';
import { api } from '../../services/api';
import { formatPrice } from '../../util/format';
import { useCart } from '../../hooks/useCart';

interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
}

interface ProductFormatted extends Product {
  priceFormatted: string;
  amount: number;
}

interface CartItemsAmount {
  [key: number]: number;
}

const Home = (): JSX.Element => {
  const [products, setProducts] = useState<ProductFormatted[]>([]);
  const { cart, addProduct, updateProductAmount } = useCart();

  // lógica para quantidade de cada produto no carrinho X //
  const cartItemsAmount = cart.reduce((sumAmount, product) => {
    sumAmount[product.id] += product.amount;

    return sumAmount
  }, {
    1: 0,
    2: 0,
    3: 0,
    4: 0,
    5: 0,
    6: 0,
  } as CartItemsAmount);

  // buscar produtos da API X //
  useEffect(() => {
    async function loadProducts() {
      const response = await api.get('/products');

      setProducts(response.data);
    }
    loadProducts();
  }, []);

  // adicionar produto ao carrinho X //
  function handleAddProduct(id: number) {

    const product = cart.find(product => product.id === id);
    if (product) {
      updateProductAmount({
        productId: id,
        amount: product.amount + 1
      })
    } else {
      addProduct(id);
    }
    
  }

  return (
    <ProductList>
      {products.map((product) => (
        <li key={product.id}>
          <img src={product.image} alt={product.title} />
          <strong>{product.title}</strong>
          <span>{formatPrice(product.price)}</span>
          <button
            type="button"
            data-testid="add-product-button"
            onClick={() => handleAddProduct(product.id)}
          >
            <div data-testid="cart-product-quantity">
              <MdAddShoppingCart size={16} color="#FFF" />
              {cartItemsAmount[product.id] || 0}
            </div>

            <span>ADICIONAR AO CARRINHO</span>
          </button>
        </li>
      ))}

    </ProductList>
  );
};

export default Home;
