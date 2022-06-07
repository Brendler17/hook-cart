export interface Product {
  id: number;
  title: string;
  price: number;
  image: string;
  amount: number;
  stockLimit: number;
}

export interface Stock {
  id: number;
  amount: number;
}
