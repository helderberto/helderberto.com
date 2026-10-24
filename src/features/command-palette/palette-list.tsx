import { Fragment } from 'react';
import styles from './command-palette.module.css';
import type { PaletteItem } from './palette-items';

interface PaletteListProps {
  items: PaletteItem[];
  activeIndex: number;
  onSelect: (item: PaletteItem) => void;
  onActivate: (index: number) => void;
}

export function PaletteList({
  items,
  activeIndex,
  onSelect,
  onActivate,
}: PaletteListProps) {
  return (
    <ul
      id="command-palette-listbox"
      role="listbox"
      aria-label="Results"
      className={styles.list}
    >
      {items.map((item, index) => {
        const showGroup = index === 0 || items[index - 1].group !== item.group;
        const Icon = item.icon;
        return (
          <Fragment key={item.id}>
            {showGroup && (
              <li role="presentation" className={styles.groupLabel}>
                {item.group}
              </li>
            )}
            <li
              id={item.id}
              role="option"
              aria-selected={index === activeIndex}
              className={styles.option}
              onClick={() => onSelect(item)}
              onMouseMove={() => onActivate(index)}
            >
              <Icon className={styles.optionIcon} aria-hidden="true" />
              <span className={styles.optionLabel}>{item.label}</span>
            </li>
          </Fragment>
        );
      })}
    </ul>
  );
}
