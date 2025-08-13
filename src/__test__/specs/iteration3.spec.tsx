import { fireEvent, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { server } from '@/server/node';
import ProductDetailPage from '../../pages/ProductDetailPage';
import { renderWith } from '../render-with';

describe('ProductDetailPage Iteration 3 - 상품 상세 페이지 기능 검증', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  const mockProduct = {
    id: 1,
    name: '치즈홀 크래커',
    category: 'CRACKER',
    stock: 5,
    price: 10.85,
    description: '로봇 캐릭터 모양의 귀리 비스킷',
    detailDescription:
      '달 표면에서 수확한 특별한 구멍낸 크래커. 달의 분화구를 연상시키는 다양한 크기의 구멍과 고소한 풍미가 특징인 크래커.',
    images: [
      '/moon-cheese-images/cracker-1-1.jpg',
      '/moon-cheese-images/cracker-1-2.jpg',
      '/moon-cheese-images/cracker-1-3.jpg',
      '/moon-cheese-images/cracker-1-4.jpg',
    ],
    rating: 4.0,
    isGlutenFree: true,
  };

  const mockRecommendProducts = [
    {
      id: 2,
      name: '월레스의 웬슬리데일',
      category: 'CHEESE',
      stock: 10,
      price: 12.99,
      description: '월레스가 아침마다 찾는 바로 그 치즈!',
      detailDescription: '전통 영국 웬슬리데일의 부드럽고 크리미한 풍미',
      images: ['/moon-cheese-images/cheese-1-1.jpg'],
      rating: 4.5,
    },
    {
      id: 3,
      name: '문라이트 카모마일 티',
      category: 'TEA',
      stock: 8,
      price: 7.0,
      description: '달빛 같은 부드러운 허브차',
      detailDescription: '달빛 같은 부드러운 허브차',
      images: ['/moon-cheese-images/tea-1-1.jpg'],
      rating: 5.0,
      isCaffeineFree: true,
    },
  ];

  describe('1. 상품 상세 정보 표시', () => {
    test('서버에서 상품 상세 정보를 불러와서 표시해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      /**
       * THEN
       * 상품 정보가 화면에 표시되어야 한다
       */
      await waitFor(
        async () => {
          const productName = await screen.findByText('치즈홀 크래커');
          const productPrice = await screen.findByText('$10.85');
          const productDescription = await screen.findByText('달 표면에서 수확한 특별한 구멍낸 크래커');

          expect(productName).toBeTruthy();
          expect(productPrice).toBeTruthy();
          expect(productDescription).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('통화 변경 시 가격이 올바르게 변환되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      const currencyToggle = await screen.findByTestId('currency-toggle');
      fireEvent.click(currencyToggle);

      /**
       * THEN
       * 가격이 KRW로 변환되어 표시되어야 한다
       */
      await waitFor(
        async () => {
          // 10.85 * 1300 = 14,105원
          const convertedPrice = await screen.findByText('14,105원');
          expect(convertedPrice).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('2. 장바구니 기능', () => {
    test('초기 상태에서는 장바구니 담기 버튼이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      /**
       * THEN
       * 장바구니 담기 버튼이 표시되어야 한다
       */
      await waitFor(
        async () => {
          const cartButton = await screen.findByText('장바구니 담기');
          expect(cartButton).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('수량을 선택하고 장바구니에 담을 수 있어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링하고 수량을 증가시킨 후 장바구니에 담을 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      await waitFor(async () => {
        const cartButton = await screen.findByText('장바구니 담기');
        expect(cartButton).toBeTruthy();
      });
      const user = userEvent.setup();

      const plusButton = screen.getByRole('button', {
        name: /Increase value/i,
      });
      await user.click(plusButton);
      await user.click(plusButton);

      const cartButton = screen.getByText('장바구니 담기');
      await user.click(cartButton);

      /**
       * THEN
       * 장바구니 아이콘에 뱃지가 표시되고 버튼이 "장바구니에서 제거"로 변경되어야 한다
       */
      await waitFor(async () => {
        const cartBadge = await screen.findByText('2');
        const removeButton = await screen.findByText('장바구니에서 제거');

        expect(cartBadge).toBeTruthy();
        expect(removeButton).toBeTruthy();
      });
    });

    test('장바구니에 상품이 있을 때 카운터가 비활성화되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품을 장바구니에 담은 후
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      await waitFor(async () => {
        const cartButton = await screen.findByText('장바구니 담기');
        expect(cartButton).toBeTruthy();
      });

      const plusButton = screen.getByRole('button', {
        name: /Increase value/i,
      });
      fireEvent.click(plusButton);

      const cartButton = screen.getByText('장바구니 담기');
      fireEvent.click(cartButton);

      /**
       * THEN
       * + 버튼과 - 버튼이 비활성화되어야 한다
       */
      await waitFor(async () => {
        const plusButtons = await screen.findAllByRole('button', {
          name: /Increase value/i,
        });
        const minusButtons = await screen.findAllByRole('button', {
          name: /Decrease value/i,
        });

        expect(plusButtons[0]).toHaveProperty('disabled', true);
        expect(minusButtons[0]).toHaveProperty('disabled', true);
      });
    });

    // test('재고 한계에 도달하면 + 버튼이 비활성화되어야 한다', async () => {
    //   /**
    //    * GIVEN
    //    * 재고가 적은 상품 상세 정보가 제공되는 상황
    //    */
    //   const lowStockProduct = { ...mockProduct, stock: 2 };

    //   server.use(
    //     http.get('/api/exchange-rate', () => {
    //       return HttpResponse.json({
    //         exchangeRate: { KRW: 1300, USD: 1 },
    //       });
    //     }),
    //     http.get('/api/product/1', () => {
    //       return HttpResponse.json(lowStockProduct);
    //     })
    //   );

    //   /**
    //    * WHEN
    //    * 상품 상세 페이지를 렌더링하고 재고만큼 수량을 증가시킬 때
    //    */
    //   renderWith(<ProductDetailPage />, {
    //     router: { initialEntries: ['/product/1'] },
    //   });

    //   await waitFor(() => {
    //     const cartButton = screen.getByText('장바구니 담기');
    //     expect(cartButton).toBeTruthy();
    //   });

    //   const plusButton = screen.getByRole('button', { name: /Increase value/i });
    //   fireEvent.click(plusButton);
    //   fireEvent.click(plusButton);

    //   /**
    //    * THEN
    //    * + 버튼이 비활성화되어야 한다
    //    */
    //   await waitFor(() => {
    //     expect(plusButton).toHaveProperty('disabled', true);
    //   });
    // });

    test('장바구니에서 제거 버튼을 클릭하면 상품이 제거되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 상세 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        })
      );

      /**
       * WHEN
       * 상품을 장바구니에 담은 후 제거 버튼을 클릭할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      await waitFor(async () => {
        const cartButton = await screen.findByText('장바구니 담기');
        expect(cartButton).toBeTruthy();
      });

      const plusButton = screen.getByRole('button', {
        name: /Increase value/i,
      });
      fireEvent.click(plusButton);

      const cartButton = screen.getByText('장바구니 담기');
      fireEvent.click(cartButton);

      await waitFor(async () => {
        const removeButton = await screen.findByText('장바구니에서 제거');
        expect(removeButton).toBeTruthy();
      });

      const removeButton = screen.getByText('장바구니에서 제거');
      fireEvent.click(removeButton);

      /**
       * THEN
       * 장바구니 뱃지가 사라지고 버튼이 "장바구니 담기"로 변경되어야 한다
       */
      await waitFor(async () => {
        const cartButton = await screen.findByText('장바구니 담기');
        const cartBadge = screen.queryByText('1');

        expect(cartButton).toBeTruthy();
        expect(cartBadge).toBeFalsy();
      });
    });
  });

  describe('3. 추천 상품 기능', () => {
    test('추천 상품 목록이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보, 상품 상세 정보, 추천 상품 목록이 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return HttpResponse.json(mockProduct);
        }),
        http.get('/api/product/recommend/1', () => {
          return HttpResponse.json({
            recommendProductIds: [2, 3],
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: [mockProduct, ...mockRecommendProducts],
          });
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      /**
       * THEN
       * 추천 상품들이 화면에 표시되어야 한다
       */
      await waitFor(
        async () => {
          const recommendationTitle = await screen.findByText('추천 제품');
          expect(recommendationTitle).toBeTruthy();

          // 추천 상품들이 화면에 있는지 확인
          const recommendProduct1 =
            (await screen.findByText('월레스의 웬슬리데일')) || (await screen.findByText(/월레스의.*웬슬리데일/));
          const recommendProduct2 =
            (await screen.findByText('문라이트 카모마일 티')) || (await screen.findByText(/문라이트.*카모마일.*티/));

          expect(recommendProduct1).toBeTruthy();
          expect(recommendProduct2).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('4. 에러 처리', () => {
    test('상품 상세 조회에 실패하면 에러 화면이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보는 정상적으로 제공되지만 상품 상세 조회에서 서버 에러가 발생하는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/1', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        })
      );

      /**
       * WHEN
       * 상품 상세 페이지를 렌더링할 때
       */
      renderWith(<ProductDetailPage />, {
        router: { initialEntries: ['/product/1'] },
      });

      /**
       * THEN
       * 에러 메시지가 표시되어야 한다
       */
      await waitFor(
        async () => {
          const errorElement = await screen.findByText('서버 연결에 실패했어요');
          expect(errorElement).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });
});
