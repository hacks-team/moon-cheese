import { HttpResponse, http } from 'msw';
import {
  GRADE_POINTS,
  gradePointList,
  gradeShippingList,
  products as PRODUCTS,
  type Product,
  recommendProductIdMap,
} from './data';

const ERROR_CHANCE = 0.33;

type RecentProduct = {
  id: number;
  thumbnail: string;
  name: string;
  price: number;
};

const products = [...PRODUCTS];
const defaultRecentProducts = convertToRecentProduct([products[0], products[1], products[2]]);

let userPoint = 0;
let userGrade = 'EXPLORER';

let recentProducts: RecentProduct[] = defaultRecentProducts;

const delay = (minMs: number = 120, maxMs: number = 300) =>
  new Promise(resolve => setTimeout(resolve, Math.floor(Math.random() * (maxMs - minMs + 1)) + minMs));

const KRW_EXCHANGE_RATE = Math.floor(Math.random() * (1400 - 1200 + 1)) + 1200;

export const handlers = [
  http.get('/api/product/list', async () => {
    await delay();
    return HttpResponse.json(
      {
        products: products,
      },
      { status: 200 }
    );
  }),

  http.get('/api/product/:id', async ({ params }) => {
    await delay();
    const { id } = params;
    if (!id) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request',
      });
    }

    const isError = isErrorRandomly(ERROR_CHANCE);
    if (isError) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    const product = products.find(product => product.id === Number(id));
    if (!product) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      });
    }

    return HttpResponse.json(product, { status: 200 });
  }),

  http.get('/api/product/recommend/:id', async ({ params }) => {
    await delay();
    const isError = isErrorRandomly(ERROR_CHANCE);
    if (isError) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }
    const { id } = params;
    if (!id) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request',
      });
    }

    const product = products.find(product => product.id === Number(id));
    if (!product) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      });
    }

    const recommendProductIds = recommendProductIdMap[product.id as keyof typeof recommendProductIdMap];

    if (!recommendProductIds) {
      return new HttpResponse(null, {
        status: 404,
        statusText: 'Not Found',
      });
    }

    return HttpResponse.json({ recommendProductIds }, { status: 200 });
  }),

  http.get('/api/exchange-rate', async () => {
    await delay();
    return HttpResponse.json(
      {
        exchangeRate: {
          KRW: KRW_EXCHANGE_RATE,
          USD: 1,
        },
      },
      { status: 200 }
    );
  }),

  http.get('/api/me', async () => {
    await delay();
    const isError = isErrorRandomly(ERROR_CHANCE);
    if (isError) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    return HttpResponse.json(
      {
        point: userPoint,
        grade: userGrade,
      },
      { status: 200 }
    );
  }),

  http.get('/api/grade/point', async () => {
    await delay();
    const isError = isErrorRandomly(ERROR_CHANCE);
    if (isError) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    return HttpResponse.json(
      {
        gradePointList,
      },
      { status: 200 }
    );
  }),

  http.get('/api/grade/shipping', async () => {
    await delay();
    return HttpResponse.json(
      {
        gradeShippingList,
      },
      { status: 200 }
    );
  }),

  http.get('/api/recent/product/list', async () => {
    await delay();
    return HttpResponse.json(
      {
        recentProducts,
      },
      { status: 200 }
    );
  }),

  http.post<
    object,
    {
      data: {
        deliveryType: 'EXPRESS' | 'PREMIUM';
        totalPrice: number;
        items: { productId: number; quantity: number }[];
      };
    }
  >('/api/product/purchase', async ({ request }) => {
    await delay();
    const isError = isErrorRandomly(ERROR_CHANCE);
    if (isError) {
      return new HttpResponse(null, {
        status: 500,
        statusText: 'Internal Server Error',
      });
    }

    const body = await request.json();
    if (!body) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Bad Request',
      });
    }

    const { deliveryType, totalPrice, items } = body.data;

    if (!deliveryType || !totalPrice || !items || !Array.isArray(items)) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Invalid request body',
      });
    }

    // 상품 존재 및 재고 검증
    const isAllProductExists = items.every(({ productId }) => products.some(product => product.id === productId));

    const isAllProductStockEnough = items.every(({ productId, quantity }) => {
      const product = products.find(product => product.id === productId);
      if (!product) {
        return false;
      }
      return product.stock >= quantity;
    });

    if (!isAllProductExists || !isAllProductStockEnough) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Product not available or insufficient stock',
      });
    }

    // 가격 검증
    const calculatedItemsPrice = items.reduce((total, { productId, quantity }) => {
      const product = products.find(p => p.id === productId);
      return total + (product ? product.price * quantity : 0);
    }, 0);

    // 배송비 계산
    let calculatedDeliveryFee = 0;
    if (deliveryType === 'EXPRESS') {
      calculatedDeliveryFee = 0; // Express는 항상 무료
    } else if (deliveryType === 'PREMIUM') {
      if (calculatedItemsPrice >= 30) {
        calculatedDeliveryFee = 0; // $30 이상이면 무료
      } else {
        // 등급별 배송비 (현재는 EXPLORER 기준으로 계산, 실제로는 사용자 등급을 확인해야 함)
        if (userGrade === 'EXPLORER') calculatedDeliveryFee = 2;
        else if (userGrade === 'PILOT') calculatedDeliveryFee = 1;
        else if (userGrade === 'COMMANDER') calculatedDeliveryFee = 0;
      }
    }

    const calculatedTotalPrice = calculatedItemsPrice + calculatedDeliveryFee;

    // 총액 검증 (소수점 오차 고려하여 0.01 범위 내에서 허용)
    if (Math.abs(totalPrice - calculatedTotalPrice) > 0.01) {
      return new HttpResponse(null, {
        status: 400,
        statusText: 'Total price mismatch',
      });
    }

    // 구매 처리
    const purchasedProducts = products.filter(product => items.some(({ productId }) => productId === product.id));

    products.forEach(product => {
      const quantity = items.find(({ productId }) => productId === product.id)?.quantity;

      if (quantity) {
        product.stock -= quantity;
      }
    });

    recentProducts = convertToRecentProduct(purchasedProducts);

    userPoint += purchasedProducts.reduce((acc, product) => {
      const item = items.find(({ productId }) => productId === product.id);
      return acc + product.price * (item?.quantity || 0) * 0.1;
    }, 0);

    userGrade = calcGradeFromPoint(userPoint);

    return HttpResponse.json(null, { status: 200 });
  }),
];

function isErrorRandomly(threshold: number) {
  const randomNumber = Math.random();
  return randomNumber < threshold;
}

function calcGradeFromPoint(point: number) {
  if (point >= GRADE_POINTS.COMMANDER) {
    return 'COMMANDER';
  }
  if (point >= GRADE_POINTS.PILOT) {
    return 'PILOT';
  }
  return 'EXPLORER';
}

function convertToRecentProduct(products: Product[]): RecentProduct[] {
  return products.map(product => ({
    id: product.id,
    thumbnail: product.images[0],
    name: product.name,
    price: product.price,
  }));
}
