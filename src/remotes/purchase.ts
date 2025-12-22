import { http } from '@/utils/http';

interface PostPurchaseRequest {
  deliveryType: 'EXPRESS' | 'PREMIUM';
  totalPrice: number;
  items: {
    productId: number;
    quantity: number;
  }[];
}
export const postPurchase = async (request: PostPurchaseRequest) => {
  const response = await http.post('/api/product/purchase', request);
  return response;
};
