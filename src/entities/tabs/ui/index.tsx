import React, {
  CSSProperties,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';

import styles from './styles.module.scss';

export interface TabItem {
  label: string;
  value: any;
}

interface TabsProps {
  items: TabItem[];
  value: number;
  className?: string;
  onChange: (value: number) => void;
}

interface ContainerStyleProperties extends CSSProperties {
  '--item-count'?: number;
  '--active-index'?: number;
}

export const Tabs = ({
  value: currentValue,
  onChange,
  items,
  className = '',
}: TabsProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [activeTab, setActiveTab] = useState<HTMLLIElement | null>(null);

  const activeIndex = useMemo<number>(() => {
    return items.findIndex((ele) => ele.value === currentValue) + 1;
  }, [items, currentValue]);

  const handleClick = (e: React.MouseEvent<HTMLUListElement, MouseEvent>) => {
    const target = e.target as HTMLLIElement;
    const newValue = Number(target.getAttribute('data-value'));
    if (newValue === currentValue) return;

    onChange(newValue);
    setActiveTab(target);
  };

  return (
    <div
      className={`${styles.container} ${className}`}
      ref={containerRef}
      style={
        {
          '--item-count': items.length,
          '--active-index': activeIndex,
        } as ContainerStyleProperties
      }
    >
      <div className={styles.activeTabBackground}></div>
      <ul className={styles.tabs} onClick={handleClick} ref={listRef}>
        {items &&
          items.map(({ label, value }) => (
            <li
              key={value}
              className={`${styles.tabItem} ${
                currentValue === value ? styles.active : ''
              }`}
              data-value={value}
            >
              {label}
            </li>
          ))}
      </ul>
    </div>
  );
};
