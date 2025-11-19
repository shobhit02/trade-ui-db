import * as yup from 'yup';
import { TradeFormValues } from './types';

export interface TradeFormFieldConfig {
  name: keyof TradeFormValues;
  label: string;
  type?: 'text' | 'number' | 'date';
  shrinkLabel?: boolean;
}

export const TRADE_FORM_FIELDS: TradeFormFieldConfig[] = [
  {
    name: 'tradeId',
    label: 'Trade Id',
    type: 'text',
  },
  {
    name: 'version',
    label: 'Version',
    type: 'number',
  },
  {
    name: 'counterPartyId',
    label: 'Counter-Party Id',
    type: 'text',
  },
  {
    name: 'bookId',
    label: 'Book Id',
    type: 'text',
  },
  {
    name: 'maturityDate',
    label: 'Maturity Date',
    type: 'date',
    shrinkLabel: true,
  },
];

const todayStr = () => new Date().toISOString().split('T')[0];

export const tradeFormSchema = yup.object({
  tradeId: yup.string().required('Trade Id is required'),

  version: yup
    .number()
    .typeError('Version is required')
    .min(0, 'Version must be >= 0')
    .required('Version is required'),

  counterPartyId: yup
    .string()
    .when('bookId', (bookId, schema) =>
      bookId === 'B2'
        ? schema
            .required('Counter-Party Id is required for Book B2')
            .matches(/^VIP-/, 'For Book B2, Counter-Party Id must start with "VIP-"')
        : schema.required('Counter-Party Id is required')
    ),

  bookId: yup.string().required('Book Id is required'),

  maturityDate: yup
    .string()
    .required('Maturity date is required')
    .test('not-in-past', 'Maturity date must be today or later.', (value) => {
      if (!value) return false;
      return value >= todayStr();
    }),
});
