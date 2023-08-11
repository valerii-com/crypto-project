import { useTranslation } from 'react-i18next';

import { useAlerts } from 'entities/alert';
import { Exception } from 'shared/interfaces/Exception';

export const useException = () => {
  const { t } = useTranslation();
  const { addAlert } = useAlerts();

  const exception = (error: Exception) => {
    if (error?.code === 4001) {
      return addAlert({
        type: 'info',
        title: t('errors.denied'),
        message: t('errors.denied_msg'),
      });
    }

    return addAlert({
      type: 'error',
      title: t('errors.title'),
      message: t('errors.failed'),
    });
  };

  return { exception };
};
