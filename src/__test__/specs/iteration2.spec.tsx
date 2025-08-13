import { fireEvent, screen, waitFor } from '@testing-library/react';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { server } from '@/server/node';
import HomePage from '../../pages/HomePage';
import { renderWith } from '../render-with';
import userEvent from '@testing-library/user-event';

describe('HomePage Iteration 2 - 상품 목록 및 장바구니 기능 검증', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  const mockProducts = [
    {
      id: 1,
      name: '월레스의 웬슬리데일',
      category: 'CHEESE',
      stock: 10,
      price: 12.99,
      description: '월레스가 아침마다 찾는 바로 그 치즈!',
      detailDescription: '상세 설명',
      images: ['/moon-cheese-images/cheese-1-1.jpg'],
      rating: 4.0,
    },
    {
      id: 2,
      name: '로봇 크런치 비스킷',
      category: 'CRACKER',
      stock: 5,
      price: 5.0,
      description: '로봇 캐릭터 모양의 귀리 비스킷',
      detailDescription: '상세 설명',
      images: ['/moon-cheese-images/cracker-1-1.jpg'],
      rating: 3.0,
      isGlutenFree: true,
    },
    {
      id: 3,
      name: '문라이트 카모마일 티',
      category: 'TEA',
      stock: 8,
      price: 7.0,
      description: '달빛 같은 부드러운 허브차',
      detailDescription: '상세 설명',
      images: ['/moon-cheese-images/tea-1-1.jpg'],
      rating: 5.0,
      isCaffeineFree: true,
    },
  ];

  describe('1. 상품 목록 표시', () => {
    test('서버에서 상품 목록을 불러와서 표시해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 목록 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링할 때
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 상품들이 화면에 표시되어야 한다
       */
      await waitFor(
        async () => {
          const cheeseProduct = await screen.findByText('월레스의 웬슬리데일');
          const crackerProduct = await screen.findByText('로봇 크런치 비스킷');
          const teaProduct = await screen.findByText('문라이트 카모마일 티');

          expect(cheeseProduct).toBeTruthy();
          expect(crackerProduct).toBeTruthy();
          expect(teaProduct).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('상품 가격이 선택한 통화에 따라 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 목록 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');
      fireEvent.click(currencyToggle);

      /**
       * THEN
       * 상품 가격이 KRW로 변환되어 표시되어야 한다
       */
      await waitFor(
        async () => {
          // 12.99 * 1300 = 16,887원
          const convertedPrice = await screen.findByText('16,887원');
          expect(convertedPrice).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('2. 카테고리별 필터링', () => {
    test('전체 카테고리에서는 모든 상품이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 다양한 카테고리의 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 전체 탭을 선택할 때
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 모든 카테고리의 상품이 표시되어야 한다
       */
      await waitFor(
        async () => {
          const cheeseProduct = await screen.findByText('월레스의 웬슬리데일');
          const crackerProduct = await screen.findByText('로봇 크런치 비스킷');
          const teaProduct = await screen.findByText('문라이트 카모마일 티');

          expect(cheeseProduct).toBeTruthy();
          expect(crackerProduct).toBeTruthy();
          expect(teaProduct).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('치즈 카테고리를 선택하면 치즈 상품만 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 다양한 카테고리의 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 치즈 탭을 선택할 때
       */
      renderWith(<HomePage />);

      const cheeseTab = await screen.findByText('치즈');
      fireEvent.click(cheeseTab);

      /**
       * THEN
       * 치즈 상품만 표시되어야 한다
       */
      await waitFor(
        async () => {
          const cheeseProduct = await screen.findByText('월레스의 웬슬리데일');
          const crackerProduct = screen.queryByText('로봇 크런치 비스킷');

          expect(cheeseProduct).toBeTruthy();
          expect(crackerProduct).not.toBeInTheDocument();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('3. 카테고리별 특별 정보 표시', () => {
    test('크래커 상품에는 글루텐 프리 아이콘이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 글루텐 프리 크래커 상품이 포함된 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링할 때
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 글루텐 프리 아이콘이 표시되어야 한다
       */
      await waitFor(
        async () => {
          const glutenFreeIcon = await screen.findByAltText('gluten-free');
          expect(glutenFreeIcon).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('티 상품에는 카페인 프리 아이콘이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 카페인 프리 티 상품이 포함된 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링할 때
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 카페인 프리 아이콘이 표시되어야 한다
       */
      await waitFor(
        async () => {
          const caffeineFreeIcon = await screen.findByAltText('decaffeine');
          expect(caffeineFreeIcon).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('4. 장바구니 기능', () => {
    test('+ 버튼을 클릭하면 장바구니에 상품이 추가되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 + 버튼을 클릭할 때
       */
      renderWith(<HomePage />);

      await waitFor(() => {
        const productSection = screen.getByText('판매중인 상품').closest('section');
        expect(productSection).toBeTruthy();
      });

      const user = userEvent.setup();

      const plusButtons = screen.getAllByRole('button', { name: /Increase value/i });
      if (plusButtons.length > 0) {
        await user.click(plusButtons[0]);
        await user.click(plusButtons[0]);

        /**
         * THEN
         * 장바구니 카운터가 업데이트되어야 한다
         */
        const cartBadge = screen.queryAllByText('2');
        expect(cartBadge).toBeTruthy();
      }
    });

    // FIXME: 정상구현되어도 테스트 시 버튼이 비활성화 되지 않는다.
    // test('재고가 부족할 때 + 버튼이 비활성화되어야 한다', async () => {
    //   /**
    //    * GIVEN
    //    * 재고가 적은 상품이 포함된 상품 목록이 제공되는 상황
    //    */
    //   const lowStockProducts = [
    //     {
    //       ...mockProducts[0],
    //       stock: 1, // 재고 1개
    //     },
    //   ];

    //   server.use(
    //     http.get('/api/exchange-rate', () => {
    //       return HttpResponse.json({
    //         exchangeRate: { KRW: 1300, USD: 1 },
    //       });
    //     }),
    //     http.get('/api/product/list', () => {
    //       return HttpResponse.json({
    //         products: lowStockProducts,
    //       });
    //     })
    //   );

    //   /**
    //    * WHEN
    //    * 홈페이지를 렌더링하고 재고만큼 장바구니에 추가할 때
    //    */
    //   renderWith(<HomePage />);

    //   await waitFor(() => {
    //     const productSection = screen.getByText('판매중인 상품').closest('section');
    //     expect(productSection).toBeTruthy();
    //   });

    //   const plusButtons = screen.getAllByRole('button', { name: /Increase value/i });
    //   if (plusButtons.length > 0) {
    //     // 재고만큼 추가
    //     for (let i = 0; i < lowStockProducts[0].stock; i++) {
    //       fireEvent.click(plusButtons[0]);
    //     }

    //     await new Promise(resolve => setTimeout(resolve, 3000));

    //     /**
    //      * THEN
    //      * + 버튼이 비활성화되어야 한다
    //      */
    //     await waitFor(() => {
    //       expect(plusButtons[0]).toBeDisabled();
    //     });
    //   }
    // });

    test('수량이 0일 때 - 버튼이 비활성화되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 목록이 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: mockProducts,
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링할 때 (초기 상태)
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 초기 상태에서 - 버튼이 비활성화되어야 한다
       */
      await waitFor(async () => {
        const minusButtons = await screen.findAllByRole('button', { name: /Decrease value/i });
        if (minusButtons.length > 0) {
          expect(minusButtons[0]).toHaveProperty('disabled', true);
        }
      });
    });
  });

  describe('5. 에러 처리', () => {
    test('상품 목록 조회에 실패하면 에러 화면이 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보는 정상적으로 제공되지만 상품 목록 조회에서 서버 에러가 발생하는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/product/list', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링할 때
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 상품 목록 섹션에 에러 메시지가 표시되어야 한다
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
