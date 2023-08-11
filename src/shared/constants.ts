export enum AUCTION_STATUS {
  AWAITING = 0,
  ACTIVATED = 1,
  IN_PROGRESS = 2,
  ENDED = 3,
  CLOSED = 4,
  CANCELLED = 5,
}

export enum ROUTES {
  ROOT = '/',
  AUCTION = '/auction',
  MY_AUCTIONS = '/my-auctions',
  COMPLETED = '/completed',
  SELECTING = '/selecting',
  CREATE = '/create',
  SERVER_ERROR = '/server-error',
}
