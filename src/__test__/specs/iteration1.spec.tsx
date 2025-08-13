import { fireEvent, screen, waitFor } from '@testing-library/react';
import { userEvent } from '@testing-library/user-event';
import { HttpResponse, http } from 'msw';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import { server } from '@/server/node';
import HomePage from '../../pages/HomePage';
import { renderWith } from '../render-with';

describe('HomePage Iteration 1 - 과제 구현 검증', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    server.resetHandlers();
  });

  describe('1. 사용할 통화를 선택할 수 있어야 한다', () => {
    test('통화 토글 버튼이 화면에 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
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
       * 통화 토글 버튼이 화면에 표시되어야 한다
       */
      await waitFor(
        () => {
          const currencyToggle = screen.findByTestId('currency-toggle');
          expect(currencyToggle).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('기본 통화는 USD로 설정되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 최근 구매 상품 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 4.0,
              },
            ],
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
       * 기본 통화가 USD로 표시되어야 한다
       */
      await waitFor(
        async () => {
          const usdPrice = await screen.findByText('$4');
          expect(usdPrice).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('통화를 변경할 경우 최근 구매한 상품의 가격이 변경되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 최근 구매 상품 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 10.0, // USD 10.0 = KRW 13,000
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화 토글을 클릭할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        fireEvent.click(currencyToggle);

        /**
         * THEN
         * 통화가 KRW로 변경되고 가격이 환율에 따라 변환되어야 한다
         */
        // 초기 USD 가격 확인
        await waitFor(
          async () => {
            const initialPrice = await screen.findByText('$10');
            const convertedPrice = await screen.findByText('13,000원');
            expect(initialPrice).toBeTruthy();
            expect(convertedPrice).toBeTruthy();
          },
          { timeout: 3000 }
        );
      }
    });

    test('원화일 경우 소수점은 반올림을 적용해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 소수점이 있는 가격의 상품 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 12.99, // 12.99 * 1300 = 16,887
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        fireEvent.click(currencyToggle);

        /**
         * THEN
         * KRW 가격이 소수점 없이 반올림되어 표시되어야 한다
         */
        await waitFor(
          async () => {
            const krwPrice = await screen.findByText('16,887원');

            if (krwPrice) {
              expect(krwPrice).not.match(/\.\d/);
            }
          },
          { timeout: 3000 }
        );
      }
    });

    test('금액은 자릿수에 맞게 콤마(,)를 추가해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 큰 금액의 상품 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 100.0, // USD 100.0 = KRW 130,000
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        const user = userEvent.setup();
        await user.click(currencyToggle);

        /**
         * THEN
         * KRW 가격이 천단위 콤마와 함께 표시되어야 한다
         */
        await waitFor(
          async () => {
            const formattedPrice = await screen.findByText('130,000원');
            expect(formattedPrice).toBeTruthy();
          },
          { timeout: 3000 }
        );
      }
    });

    test('선택한 통화는 서비스 전체에 적용되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 여러 상품의 최근 구매 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈 1',
                price: 10.0,
              },
              {
                id: 2,
                thumbnail: '/moon-cheese-images/cheese-2-1.jpg',
                name: '테스트 치즈 2',
                price: 20.0,
              },
            ],
          });
        }),
        http.get('/api/product/list', () => {
          return HttpResponse.json({
            products: [
              {
                id: 3,
                name: '테스트',
                category: 'CHEESE',
                stock: 3,
                price: 15,
                description: '전통 영국식 크리미한 웬슬리데일 치즈',
                detailDescription:
                  '"월레스가 아침마다 찾는 바로 그 치즈!" 전통 영국 웬슬리데일의 부드럽고 크리미한 풍미. 촘촘하고 촉촉한 질감 속에 은은한 단맛이 어우러져, 클래식한 영국식 브렉퍼스트에 완벽하게 어울립니다.',
                images: [
                  '/moon-cheese-images/cheese-1-1.jpg',
                  '/moon-cheese-images/cheese-1-2.jpg',
                  '/moon-cheese-images/cheese-1-3.jpg',
                  '/moon-cheese-images/cheese-1-4.jpg',
                ],
                rating: 4.8,
              },
              {
                id: 4,
                name: '테스트',
                category: 'CHEESE',
                stock: 3,
                price: 25,
                description: '전통 영국식 크리미한 웬슬리데일 치즈',
                detailDescription:
                  '"월레스가 아침마다 찾는 바로 그 치즈!" 전통 영국 웬슬리데일의 부드럽고 크리미한 풍미. 촘촘하고 촉촉한 질감 속에 은은한 단맛이 어우러져, 클래식한 영국식 브렉퍼스트에 완벽하게 어울립니다.',
                images: [
                  '/moon-cheese-images/cheese-1-1.jpg',
                  '/moon-cheese-images/cheese-1-2.jpg',
                  '/moon-cheese-images/cheese-1-3.jpg',
                  '/moon-cheese-images/cheese-1-4.jpg',
                ],
                rating: 4.8,
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const user = userEvent.setup();

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        await user.click(currencyToggle);

        /**
         * THEN
         * 페이지의 모든 상품 가격이 KRW로 변환되어 표시되어야 한다
         */
        await waitFor(
          async () => {
            const price1 = await screen.findByText('13,000원');
            const price2 = await screen.findByText('26,000원');

            expect(price1).toBeTruthy();
            expect(price2).toBeTruthy();
          },
          { timeout: 3000 }
        );
      }
    });
  });

  describe('2. 다음 등급까지 남은 포인트 그래프', () => {
    test('현재 포인트와 다음 등급까지 남은 포인트가 표시되어야 한다', async () => {
      /**
       * GIVEN
       * 사용자 정보와 등급별 포인트 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/me', () => {
          return HttpResponse.json({
            point: 4,
            grade: 'EXPLORER',
          });
        }),
        http.get('/api/grade/point', () => {
          return HttpResponse.json({
            gradePointList: [
              { type: 'EXPLORER', minPoint: 0 },
              { type: 'PILOT', minPoint: 7 },
              { type: 'COMMANDER', minPoint: 15 },
            ],
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
       * 현재 포인트와 다음 등급까지 남은 포인트가 표시되어야 한다
       */
      await waitFor(
        async () => {
          const currentPointText = await screen.findByText('4P');
          expect(currentPointText).toBeTruthy();

          // 남은 포인트 표시 확인 (7-4=3p)
          const remainingPointText = await screen.findByText('3P');
          expect(remainingPointText).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('포인트 진행률을 시각적으로 표시하는 그래프가 있어야 한다', async () => {
      /**
       * GIVEN
       * 사용자 정보와 등급별 포인트 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/me', () => {
          return HttpResponse.json({
            point: 4,
            grade: 'EXPLORER',
          });
        }),
        http.get('/api/grade/point', () => {
          return HttpResponse.json({
            gradePointList: [
              { type: 'EXPLORER', minPoint: 0 },
              { type: 'PILOT', minPoint: 7 },
              { type: 'COMMANDER', minPoint: 15 },
            ],
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
       * 포인트 진행률을 시각적으로 표시하는 프로그레스 바가 있어야 한다
       */
      await waitFor(
        () => {
          const progressElement = document.querySelector('[data-testid*="progress-bar"]');
          expect(progressElement).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });

  describe('3. 에러 화면 처리', () => {
    test('서버에 문제가 있을 경우 에러 화면을 노출해야 한다', async () => {
      /**
       * GIVEN
       * 내정보, 등급별 포인트, 최근 구매 상품 정보 조회 에러 발생 시
       *
       */
      server.use(
        http.get('/api/me', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        }),
        http.get('/api/grade/point', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        }),
        http.get('/api/recent/product/list', () => {
          return new HttpResponse(null, {
            status: 500,
            statusText: 'Internal Server Error',
          });
        })
      );

      /**
       * WHEN
       * 홈페이지 렌더링
       */
      renderWith(<HomePage />);

      /**
       * THEN
       * 에러 메시지가 2개 있는지 확인
       * => 현재등급, 최근 구매한 상품 모두 에러 메시지 표시
       */
      await waitFor(
        async () => {
          const errorElements = await screen.findAllByText(/서버 연결에 실패했어요/);
          expect(errorElements).toBeTruthy();
          expect(errorElements).toHaveLength(2);
        },
        { timeout: 30000 }
      );
    });
  });

  describe('4. 최근 구매한 상품 정보', () => {
    test('서버에서 최근 구매 상품 정보를 불러와서 표시해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 최근 구매한 상품 목록 정보가 정상적으로 제공되는 상황
       */
      const mockProducts = [
        {
          id: 1,
          thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
          name: '월레스의 오리지널 웬슬리데일',
          price: 12.99,
        },
        {
          id: 2,
          thumbnail: '/moon-cheese-images/cheese-2-1.jpg',
          name: '그랜드 데이 아웃 체다',
          price: 14.87,
        },
      ];

      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: mockProducts,
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
       * 최근 구매한 상품의 이름이 화면에 표시되어야 한다
       */
      await waitFor(
        async () => {
          const productName1 = await screen.findByText('월레스의 오리지널 웬슬리데일');
          const productName2 = await screen.findByText('그랜드 데이 아웃 체다');

          expect(productName1).toBeTruthy();
          expect(productName2).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('상품별 구매 총 금액이 표기되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 특정 가격을 가진 상품 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 12.99,
              },
            ],
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
       * 상품의 구매 금액이 USD 형식으로 표시되어야 한다
       */
      await waitFor(
        async () => {
          const priceElement = await screen.findByText('$12.99');
          expect(priceElement).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });

    test('금액은 자릿수에 맞게 콤마(,)를 추가해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 큰 금액의 상품 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 1000.0, // USD 1000.0 = KRW 1,300,000
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        fireEvent.click(currencyToggle);

        /**
         * THEN
         * KRW 가격이 천단위 콤마와 함께 표시되어야 한다
         */
        await waitFor(
          async () => {
            const formattedPrice = await screen.findByText('1,300,000원');
            expect(formattedPrice).toBeTruthy();
          },
          { timeout: 3000 }
        );
      }
    });

    test('선택한 통화에 따라 금액이 변경되어야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 상품 정보가 정상적으로 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 10.0, // USD 10.0 = KRW 13,000
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 변경할 때
       */
      renderWith(<HomePage />);

      // 초기 USD 가격 확인
      await waitFor(
        async () => {
          const initialPrice = await screen.findByText('$10');
          expect(initialPrice).toBeTruthy();
        },
        { timeout: 3000 }
      );

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        fireEvent.click(currencyToggle);

        /**
         * THEN
         * 선택한 통화에 따라 가격이 환율에 맞게 변환되어 표시되어야 한다
         */
        await waitFor(
          async () => {
            const convertedPrice = await screen.findByText('13,000원');

            expect(convertedPrice).toBeTruthy();
          },
          { timeout: 3000 }
        );
      }
    });

    test('원화일 경우 소수점은 반올림을 적용해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보와 소수점이 있는 가격의 상품 정보가 제공되는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
          return HttpResponse.json({
            recentProducts: [
              {
                id: 1,
                thumbnail: '/moon-cheese-images/cheese-1-1.jpg',
                name: '테스트 치즈',
                price: 12.99, // 12.99 * 1300 = 16,887
              },
            ],
          });
        })
      );

      /**
       * WHEN
       * 홈페이지를 렌더링하고 통화를 KRW로 변경할 때
       */
      renderWith(<HomePage />);

      const currencyToggle = await screen.findByTestId('currency-toggle');

      if (currencyToggle) {
        fireEvent.click(currencyToggle);

        /**
         * THEN
         * KRW 가격이 소수점 없이 반올림되어 표시되어야 한다
         */
        await waitFor(
          async () => {
            const krwPrice = await screen.findByText('16,887원');

            if (krwPrice) {
              expect(krwPrice).not.match(/\.\d/);
              expect(krwPrice).toBeTruthy();
            }
          },
          { timeout: 3000 }
        );
      }
    });

    test('최근 구매 상품 정보 서버 에러 시 에러 화면을 표시해야 한다', async () => {
      /**
       * GIVEN
       * 환율 정보는 정상적으로 제공되지만 최근 구매 상품 정보 조회에서 서버 에러가 발생하는 상황
       */
      server.use(
        http.get('/api/exchange-rate', () => {
          return HttpResponse.json({
            exchangeRate: { KRW: 1300, USD: 1 },
          });
        }),
        http.get('/api/recent/product/list', () => {
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
       * 최근 구매 상품 섹션에 에러 메시지가 표시되어야 한다
       */
      await waitFor(
        async () => {
          const errorElement = await screen.findByText(/서버 연결에 실패했어요/);
          expect(errorElement).toBeTruthy();
        },
        { timeout: 3000 }
      );
    });
  });
});
