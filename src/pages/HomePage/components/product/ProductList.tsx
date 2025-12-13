import { Suspense } from '@suspensive/react';
import { useSuspenseQueries } from '@tanstack/react-query';
import { useMemo } from 'react';
import { useNavigate } from 'react-router';
import { Grid } from 'styled-system/jsx';
import { formatPriceByCurrency } from '@/format/number';
import type { ProductCategory } from '@/models/product';
import { useCart } from '@/providers/cart-provider';
import { useCurrency } from '@/providers/currency-provider';
import { getExchangeRateQueryOptions } from '@/remotes/queries/exchange';
import { getProductListQueryOptions } from '@/remotes/queries/product';
import type { Product } from '@/type';
import { Counter } from '@/ui-lib';
import { getCartCount } from '@/utils/cart';
import ProductItem from '../ProductItem';

interface ProductListContainerProps {
  category?: ProductCategory;
}

const ProductListContainer = ({ category = 'ALL' }: ProductListContainerProps) => {
  const [
    {
      data: { products },
    },
    {
      data: { exchangeRate },
    },
  ] = useSuspenseQueries({
    queries: [getProductListQueryOptions(), getExchangeRateQueryOptions()],
  });
  const navigate = useNavigate();
  const { currency } = useCurrency();
  const { addCart, removeCart, carts } = useCart();

  const filteredProducts = useMemo(() => {
    if (category === 'ALL') return products;
    return products.filter(product => product.category === category);
  }, [category, products]);

  const handleAddCart = (product: Product, cartCount: number) => {
    if (product.stock <= cartCount) return;
    addCart(product);
  };

  const handleRemoveCart = (product: Product, cartCount: number) => {
    if (cartCount === 0) return;
    removeCart(product);
  };

  return (
    <Grid gridTemplateColumns="repeat(2, 1fr)" rowGap={9} columnGap={4} p={5}>
      {filteredProducts.map(product => {
        const cartCount = getCartCount(product.id, carts);
        const productCategory = product.category;

        const isDisabledMinus = cartCount === 0;
        const isDisabledPlus = product.stock <= cartCount;

        switch (productCategory) {
          case 'CHEESE':
            return (
              <ProductItem.Root key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <ProductItem.Image src={product.images[0]} alt={product.name} />
                <ProductItem.Info title={product.name} description={product.description} />
                <ProductItem.Meta>
                  <ProductItem.MetaLeft>
                    <ProductItem.Rating rating={product.rating} />
                    <ProductItem.Price>
                      {formatPriceByCurrency(product.price * exchangeRate[currency], currency)}
                    </ProductItem.Price>
                  </ProductItem.MetaLeft>
                </ProductItem.Meta>
                <Counter.Root>
                  <Counter.Minus onClick={() => handleRemoveCart(product, cartCount)} disabled={isDisabledMinus} />
                  <Counter.Display value={cartCount} />
                  <Counter.Plus onClick={() => handleAddCart(product, cartCount)} disabled={isDisabledPlus} />
                </Counter.Root>
              </ProductItem.Root>
            );
          case 'CRACKER':
            return (
              <ProductItem.Root key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <ProductItem.Image src={product.images[0]} alt={product.name} />
                <ProductItem.Info title={product.name} description={product.description} />
                <ProductItem.Meta>
                  <ProductItem.MetaLeft>
                    <ProductItem.Rating rating={product.rating} />
                    <ProductItem.Price>
                      {formatPriceByCurrency(product.price * exchangeRate[currency], currency)}
                    </ProductItem.Price>
                  </ProductItem.MetaLeft>
                  {product.isGlutenFree ? <ProductItem.FreeTag type="gluten" /> : null}
                </ProductItem.Meta>
                <Counter.Root>
                  <Counter.Minus onClick={() => handleRemoveCart(product, cartCount)} disabled={isDisabledMinus} />
                  <Counter.Display value={cartCount} />
                  <Counter.Plus onClick={() => handleAddCart(product, cartCount)} disabled={isDisabledPlus} />
                </Counter.Root>
              </ProductItem.Root>
            );
          case 'TEA':
            return (
              <ProductItem.Root key={product.id} onClick={() => navigate(`/product/${product.id}`)}>
                <ProductItem.Image src={product.images[0]} alt={product.name} />
                <ProductItem.Info title={product.name} description={product.description} />
                <ProductItem.Meta>
                  <ProductItem.MetaLeft>
                    <ProductItem.Rating rating={product.rating} />
                    <ProductItem.Price>
                      {formatPriceByCurrency(product.price * exchangeRate[currency], currency)}
                    </ProductItem.Price>
                  </ProductItem.MetaLeft>
                  {product.isCaffeineFree ? <ProductItem.FreeTag type="caffeine" /> : null}
                </ProductItem.Meta>
                <Counter.Root>
                  <Counter.Minus onClick={() => handleRemoveCart(product, cartCount)} disabled={isDisabledMinus} />
                  <Counter.Display value={cartCount} />
                  <Counter.Plus onClick={() => handleAddCart(product, cartCount)} disabled={isDisabledPlus} />
                </Counter.Root>
              </ProductItem.Root>
            );
          default:
            productCategory satisfies never;
        }
      })}
    </Grid>
  );
};
const ProductList = Suspense.with({ fallback: null }, ProductListContainer);

export { ProductList };
