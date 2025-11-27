import { setupServer } from 'msw/node';
import { http, HttpResponse } from 'msw';
import { Trade } from '../app/types';
import { todayStr } from '../app/utils/date';

const trades: Trade[] = [
  {
    tradeId: 'T1',
    version: 1,
    counterPartyId: 'CP-1',
    bookId: 'B1',
    maturityDate: '2020-05-20',
    createdDate: todayStr(),
    expired: true,
  },
  {
    tradeId: 'T2',
    version: 2,
    counterPartyId: 'CP-2',
    bookId: 'B1',
    maturityDate: '2021-05-20',
    createdDate: todayStr(),
    expired: false,
  },
  {
    tradeId: 'T2',
    version: 1,
    counterPartyId: 'CP-1',
    bookId: 'B1',
    maturityDate: '2021-05-20',
    createdDate: '2015-03-14',
    expired: false,
  },
  {
    tradeId: 'T3',
    version: 3,
    counterPartyId: 'CP-3',
    bookId: 'B2',
    maturityDate: '2014-05-20',
    createdDate: todayStr(),
    expired: true,
  },
];

export const handlers = [
  http.get('/api/trades', () => {
    return HttpResponse.json(trades);
  }),
];

export const server = setupServer(...handlers);
