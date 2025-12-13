import { useSearchParams } from 'react-router';
import { type ProductCategory, ProductCategorySchema } from '@/models/product';

const useProductCategorySeachParams = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const filter = {
    category: ProductCategorySchema.parse(searchParams.get('category')),
  };

  const updateFilter = (category: ProductCategory) => {
    searchParams.set('category', category);
    setSearchParams(searchParams);
  };

  return { filter, updateFilter };
};

export { useProductCategorySeachParams };
