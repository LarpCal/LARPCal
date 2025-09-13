import * as yup from 'yup';
import { TicketStatus } from '../../types';

const FilterLarpSchema = yup.object({
  term: yup.string(),
  title: yup.string(),
  ticketStatus: yup
    .mixed<TicketStatus>()
    .oneOf(['AVAILABLE', 'LIMITED', 'SOLD_OUT']),
  tags: yup.string(),
  startBefore: yup
    .date()
    .nullable()
    .notRequired()
    .typeError('Invalid date format'),
  startAfter: yup
    .date()
    .nullable()
    .notRequired()
    .typeError('Invalid date format'),
  endBefore: yup
    .date()
    .nullable()
    .notRequired()
    .typeError('Invalid date format'),
  endAfter: yup
    .date()
    .nullable()
    .notRequired()
    .typeError('Invalid date format'),
  allDay: yup.boolean(),
  isPublished: yup.boolean(),
  city: yup.string(),
  country: yup.string(),
  language: yup.string(),
  org: yup.string(),
});

export default FilterLarpSchema;
