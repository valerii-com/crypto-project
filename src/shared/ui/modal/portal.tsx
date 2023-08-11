import { ReactNode } from 'react';
import ReactDOM from 'react-dom';

type propTypes = { children: ReactNode };
const PORTAL_TARGET_ID = 'modal';

const Portal = ({ children }: propTypes) => {
  const portalTarget = document.getElementById(PORTAL_TARGET_ID);
  if (!portalTarget) {
    console.error(`Target for modals with id "${PORTAL_TARGET_ID}" not found`);

    return <></>;
  }

  return ReactDOM.createPortal(children, portalTarget);
};

export default Portal;
