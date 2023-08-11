import { Alert, alertState } from '../model';

export const useAlerts = () => {
  const addAlert = (alert: Alert) => {
    if (alertState()) {
      alertState(null);

      setTimeout(() => alertState(alert), 1000);
    } else {
      alertState(alert);
    }

    return setTimeout(() => removeAlert(), 5000);
  };

  const removeAlert = () => {
    return alertState(null);
  };

  return { addAlert, removeAlert };
};
