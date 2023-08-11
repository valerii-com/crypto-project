import { useRef, Dispatch, SetStateAction } from 'react';
import { useTranslation } from 'react-i18next';
import { Modal } from 'shared/ui/modal';
import styles from './styles.module.scss';
import { MoralisToken } from 'shared/interfaces/Morails';
import { Button } from 'shared/ui/button';

type propTypes = {
  submitHandler: (address: string, id: number) => void;
  selectedItem: MoralisToken | null;
  setOpenManual: Dispatch<SetStateAction<boolean>>;
};

export const ManualSelect = ({
  submitHandler,
  selectedItem,
  setOpenManual,
}: propTypes) => {
  const { t } = useTranslation();
  const addressRef = useRef<HTMLInputElement>(null);
  const idRef = useRef<HTMLInputElement>(null);

  const componentSubmit = async (event: React.SyntheticEvent) => {
    event.preventDefault();

    if (addressRef.current && idRef.current) {
      await submitHandler(
        addressRef.current.value,
        parseInt(idRef.current.value),
      );

      setOpenManual(false);
    }
  };

  return (
    <Modal className={styles.modal} closeModal={() => setOpenManual(false)}>
      <h2>Add NFT manually</h2>
      <div className={styles.heading}>
        <b>Specify NFT data</b>
      </div>
      <form
        className={styles.manualForm}
        onSubmit={componentSubmit}
        autoComplete={'off'}
      >
        <label>{t('creating.address')}</label>
        <input
          type="text"
          name="address"
          ref={addressRef}
          placeholder="0x..."
          required
        />
        <label>{t('creating.id')}</label>
        <input type="text" name="id" ref={idRef} placeholder="1" required />
        <span className={styles.readmore}>
          {t('creating.readmore')}
          <a href="#nic">{t('creating.readmore_link')}</a>
        </span>
        <Button label="Next" isSubmit />
      </form>
    </Modal>
  );
};
