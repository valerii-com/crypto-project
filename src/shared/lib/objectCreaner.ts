import { isBoolean, isNumber, isObject } from 'lodash-es';

export type MetadataField =
  | string
  | string[]
  | boolean
  | Record<string, unknown>
  | number;

export function objectCleaner(
  object: Record<string, MetadataField | null>,
): Record<string, MetadataField> {
  return Object.entries(object).reduce(
    (
      previous: Record<string, MetadataField>,
      field: [string, MetadataField | null],
    ) => {
      const [key, value] = field;

      if (isNumber(value)) {
        return { ...previous, [key]: value };
      }

      if (isObject(value) && key === 'attributes') {
        return { ...previous, [key]: value };
      }

      if (isObject(value) || (!isBoolean(value) && (!value || !value.length))) {
        return previous;
      }

      return { ...previous, [key]: value };
    },
    {},
  );
}
