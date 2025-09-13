import * as yup from 'yup';
import { TicketStatus } from '../../types';

const LarpFormSchema = yup.object({
  id: yup.number(),
  title: yup.string().required('Title is required').max(200),
  ticketStatus: yup
    .mixed<TicketStatus>()
    .oneOf(['AVAILABLE', 'LIMITED', 'SOLD_OUT', 'SOON'])
    .required('Ticket Status is required'),
  tags: yup.string(),
  start: yup
    .date()
    .required('Start date is required')
    .test(
      'is before end',
      'Start date must be before end date',
      function (value) {
        const { end } = this.parent;
        return end ? value <= end : true;
      },
    ),
  end: yup
    .date()
    .required('Start date is required')
    .test(
      'is before end',
      'Start date must be before end date',
      function (value) {
        const { start } = this.parent;
        return start ? value >= start : true;
      },
    ),
  allDay: yup.boolean(),
  city: yup.string().required('Please specify a city').max(100),
  country: yup.string().required('Please specify a country').max(100),
  language: yup.string().required('Please specify a language').max(100),
  description: yup.string().required('Description is required'),
  orgId: yup.number(),
  eventUrl: yup.string().url().max(500),
});

export default LarpFormSchema;
