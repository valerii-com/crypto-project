export const getAuctionID = (): number => {
  const urlParams = new URLSearchParams(window.location.search);
  const auctionID = urlParams.get('id')!;

  return parseInt(auctionID);
};
