import { useWeb3React } from '@web3-react/core';
import { useTranslation } from 'react-i18next';

export const Logout = () => {
  const { t } = useTranslation();
  const { deactivate } = useWeb3React();

  const logoutHandler = () => {
    sessionStorage.removeItem('defaultConnector');

    deactivate();
  };

  return (
    <button className="link" onClick={logoutHandler}>
      {t('myauctions.logout')}
    </button>
  );
};
