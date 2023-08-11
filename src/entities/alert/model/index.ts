import { makeVar } from '@apollo/client';

export interface Alert {
  type: 'success' | 'error' | 'info';
  title: string;
  message?: string;
  link?: {
    label: string;
    href: string;
  };
  offsetTop?: string;
}

export const alertState = makeVar<Alert | null>(null);
