import { Dispatch, SetStateAction, useEffect, useRef } from 'react';

import { useAdaptation } from 'shared/lib/viewportAdaptation';
import chevron from 'shared/assets/icons/chevron.svg';
import plus from 'shared/assets/icons/plus.svg';
import minus from 'shared/assets/icons/minus.svg';
import binanceIcon from 'shared/assets/icons/bnb.svg';

import styles from './styles.module.scss';

type propTypes = {
  minBid: number;
  value: number;
  setValue: Dispatch<SetStateAction<number>>;
};

export const AmountInput = ({ minBid, value, setValue }: propTypes) => {
  const viewportWidth = useAdaptation();
  const ref = useRef() as React.MutableRefObject<HTMLInputElement>;

  useEffect(() => {
    viewportWidth < 768 && ref.current.focus();
  }, [viewportWidth]);

  const controlHandler = (isDecrease: boolean) => {
    if (isDecrease && value > minBid) {
      setValue(Math.round(value * 1000 - 1) / 1000);
    }
    if (!isDecrease) {
      setValue(Math.round(value * 1000 + 1) / 1000);
    }

    ref.current.focus();
  };

  const changeHandler = ({ target }: any) => {
    target.value = target.value.substring(0, target.value.indexOf('.') + 4);

    target.value = target.value.replace(/,/, '.');

    target.selectionEnd = target.selectionStart;

    if (parseFloat(target.value) * 1000 < 0) target.value = '0';

    setValue(target.value);
  };

  const blurHandler = ({ target }: any) => {
    if (parseFloat(target.value) < minBid) {
      setValue(minBid);
    }
  };

  const keyboardControl = ({ key }: any) => {
    if (key === 'ArrowUp') controlHandler(false);
    if (key === 'ArrowDown') controlHandler(true);
  };

  return (
    <div className={styles.root}>
      <div
        className={styles.wrapper}
        onClick={() => {
          if (ref.current) ref.current.focus();
        }}
      >
        <b>BNB</b>
        <input
          id="bid-value"
          inputMode="numeric"
          type="text"
          ref={ref}
          onKeyDown={keyboardControl}
          value={value}
          autoComplete="off"
          onInput={changeHandler}
          onBlur={blurHandler}
        />
      </div>
      <div className={styles.control}>
        <div onClick={() => controlHandler(false)}>
          {viewportWidth > 1023 ? (
            <img src={chevron} alt="" />
          ) : (
            <img src={plus} alt="" />
          )}
        </div>
        <div onClick={() => controlHandler(true)}>
          {viewportWidth > 1023 ? (
            <img src={chevron} alt="" />
          ) : (
            <img src={minus} alt="" />
          )}
        </div>
      </div>
      <img className={styles.icon} src={binanceIcon} alt="" />
    </div>
  );
};
