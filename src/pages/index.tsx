import { lazy, Suspense, useEffect } from 'react';
import { useQuery, useReactiveVar } from '@apollo/client';
import { Routes, Route, useLocation } from 'react-router-dom';
import { useResetAtom } from 'jotai/utils';

import { ROUTES } from 'shared/constants';
import { GlobalAlerts } from 'entities/alert';
import { setViewport } from 'shared/lib/viewportAdaptation';
import { GetActiveData, GET_ACTIVE } from 'shared/api/graphql/queries';
import { Loader } from 'shared/ui/loader';

import { activeTabIdAtom, participatedOffsetAtom } from './my-auctions';
import { globalLoading } from 'app/providers/with-apollo';

const WelcomePage = lazy(() => import('./welcome'));
const NotFoundPage = lazy(() => import('./not-found'));
const SelectingPage = lazy(() => import('./selecting'));
const CreatingPage = lazy(() => import('./creating'));
const AuctionPage = lazy(() => import('./auction'));
const ServerErrorPage = lazy(() => import('./server-error'));
const MyAuctionsPage = lazy(() => import('./my-auctions'));
const CompletedPage = lazy(() => import('./completed'));
const LandingPage = lazy(() => import('./auction/LandingPage'));

const ROUTES_TO_KEEP_PAGINATION: ROUTES[] = [
  ROUTES.AUCTION,
  ROUTES.MY_AUCTIONS,
];

export const Routing = () => {
  const location = useLocation();
  const { data, error } = useQuery<GetActiveData>(GET_ACTIVE, {
    fetchPolicy: 'network-only',
    onCompleted: (data) => {
      globalLoading(false);
    },
  });
  const isGlobalLoading = useReactiveVar(globalLoading);

  const resetActiveTab = useResetAtom(activeTabIdAtom);
  const resetParticipatedAtom = useResetAtom(participatedOffsetAtom);
  const resetCreatedAtom = useResetAtom(participatedOffsetAtom);

  useEffect(() => {
    window.addEventListener('resize', () => {
      setViewport(window.innerWidth);
    });
  }, []);

  // My auction pagination reset
  useEffect(() => {
    const { pathname } = location;

    if (!ROUTES_TO_KEEP_PAGINATION.includes(pathname as ROUTES)) {
      resetActiveTab();
      resetCreatedAtom();
      resetParticipatedAtom();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location]);

  if (error) return <ServerErrorPage />;

  return (
    <>
      {isGlobalLoading ? <Loader /> : null}
      <Suspense>
        <Routes location={location} key={location.pathname}>
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path={ROUTES.ROOT}
            element={
              data?.isActive ? (
                <LandingPage currentId={data?.isActive} />
              ) : (
                <WelcomePage />
              )
            }
          />
          <Route
            path={ROUTES.AUCTION}
            element={<AuctionPage currentId={data?.isActive} />}
          />
          <Route path={ROUTES.MY_AUCTIONS} element={<MyAuctionsPage />} />
          <Route path={ROUTES.COMPLETED} element={<CompletedPage />} />
          <Route path={ROUTES.SELECTING} element={<SelectingPage />} />
          <Route path={ROUTES.CREATE} element={<CreatingPage />} />
          <Route path={ROUTES.SERVER_ERROR} element={<ServerErrorPage />} />
        </Routes>
      </Suspense>
      <GlobalAlerts />
    </>
  );
};
