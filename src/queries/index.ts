import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { exchangeRateQueries } from './exchangeRate';
import { gradeQueries } from './grade';
import { productQueries } from './product';
import { userQueries } from './user';

export const queries = mergeQueryKeys(userQueries, gradeQueries, exchangeRateQueries, productQueries);
