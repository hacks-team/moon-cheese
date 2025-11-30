import { mergeQueryKeys } from '@lukemorales/query-key-factory';
import { exchangeRateQueries } from './exchangeRate';
import { gradeQueries } from './grade';
import { recentProductQueries } from './recentProduct';
import { userQueries } from './user';

export const queries = mergeQueryKeys(userQueries, gradeQueries, recentProductQueries, exchangeRateQueries);
