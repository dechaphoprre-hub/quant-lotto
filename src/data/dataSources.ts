import { MarketType } from '../types';

export type DataSourceStatus = 'OFFICIAL' | 'SECONDARY' | 'UNVERIFIED';

export interface LotteryDataSource {
  market: MarketType;
  status: DataSourceStatus;
  name: string;
  url: string;
  notes: string;
}

/** Sources are documented separately so bundled snapshots are not presented as live official data. */
export const LOTTERY_DATA_SOURCES: Record<MarketType, LotteryDataSource[]> = {
  THAI: [
    {
      market: 'THAI',
      status: 'OFFICIAL',
      name: 'Government Lottery Office (GLO)',
      url: 'https://www.glo.or.th/mission/awarding/orderby-time',
      notes: 'Primary source for Thai government lottery results; verify each draw before publishing.'
    }
  ],
  LAO: [
    {
      market: 'LAO',
      status: 'UNVERIFIED',
      name: 'No verified public primary source configured',
      url: '',
      notes: 'Do not label bundled Lao records official until a primary source or licensed provider is configured.'
    }
  ],
  HANOI: [
    {
      market: 'HANOI',
      status: 'SECONDARY',
      name: 'Xoso.com.vn / Hanoi lottery results',
      url: 'https://xoso.com.vn/xo-so-mien-bac/xsmb-p1.html',
      notes: 'Public secondary source; reconcile against the Hanoi Lottery Company before publishing as verified.'
    }
  ],
  HANOI_VIP: [
    {
      market: 'HANOI_VIP',
      status: 'UNVERIFIED',
      name: 'No verified public primary source configured',
      url: '',
      notes: 'VIP is not the same product as Hanoi traditional lottery; do not infer or duplicate results.'
    }
  ]
};
