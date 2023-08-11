import de from 'shared/assets/icons/lang/deutch.svg';
import ru from 'shared/assets/icons/lang/russian.svg';
import en from 'shared/assets/icons/lang/states.svg';

export const ActiveLanguage = ({ lang }: { lang: string }) => {
  switch (lang) {
    case 'de':
      return (
        <>
          DE <img src={de} alt="" />
        </>
      );
    case 'ru':
      return (
        <>
          RU <img src={ru} alt="" />
        </>
      );
  }

  return (
    <>
      EN <img src={en} alt="" />{' '}
    </>
  );
};
