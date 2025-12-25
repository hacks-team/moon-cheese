import { useCartAction, useCartValue } from '@/providers/CartProvider';
import { useCurrencyContext } from '@/providers/CurrencyProvider';
import { queries } from '@/queries';
import type { Product } from '@/types/product';
import { Counter } from '@/ui-lib';
import { formatPrice } from '@/utils/currency';
import { useSuspenseQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router';
import ProductItem from './ProductItem';

function ProductCard({ product }: { product: Product }) {
  const navigate = useNavigate();
  const [currency] = useCurrencyContext();
  const { getQuantity } = useCartValue();
  const { increaseQuantity, decreaseQuantity } = useCartAction();

  const { data: exchangeRateData } = useSuspenseQuery(queries.exchangeRate.current);
  const exchangeRate = exchangeRateData.exchangeRate;

  const quantity = getQuantity(product.id);
  const isPlusDisabled = quantity >= product.stock;
  const isMinusDisabled = quantity <= 0;

  const handleClick = () => {
    navigate(`/product/${product.id}`);
  };

  const handleIncrease = () => {
    if (quantity < product.stock) {
      increaseQuantity(product.id);
    }
  };

  const handleDecrease = () => {
    decreaseQuantity(product.id);
  };

  return (
    <ProductItem.Root onClick={handleClick}>
      <ProductItem.Image src={product.images[0]} alt={product.name} />
      <ProductItem.Info title={product.name} description={product.description} />
      <ProductItem.Meta>
        <ProductItem.MetaLeft>
          <ProductItem.Rating rating={product.rating} />
          <ProductItem.Price>{formatPrice(product.price, currency, exchangeRate)}</ProductItem.Price>
        </ProductItem.MetaLeft>
        <ProductFreeTag product={product} />
      </ProductItem.Meta>
      <Counter.Root>
        <Counter.Minus onClick={handleDecrease} disabled={isMinusDisabled} />
        <Counter.Display value={quantity} />
        <Counter.Plus onClick={handleIncrease} disabled={isPlusDisabled} />
      </Counter.Root>
    </ProductItem.Root>
  );
}

function ProductFreeTag({ product }: { product: Product }) {
  if (product.category === 'CRACKER' && product.isGlutenFree) {
    return <ProductItem.FreeTag type="gluten" />;
  }

  if (product.category === 'TEA' && product.isCaffeineFree) {
    return <ProductItem.FreeTag type="caffeine" />;
  }

  return null;
}

export default ProductCard;
