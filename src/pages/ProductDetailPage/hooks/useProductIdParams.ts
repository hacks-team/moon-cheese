import { useParams } from 'react-router';
import { ProductIdSchema } from '@/models/product';

const useProductIdParams = () => {
  const params = useParams();
  return ProductIdSchema.parse(params.id);
};

export { useProductIdParams };
