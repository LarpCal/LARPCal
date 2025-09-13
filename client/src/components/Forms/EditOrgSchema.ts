import * as yup from 'yup';

const EditOrgSchema = yup.object({
  id: yup.number(),
  username: yup.string().required('Username is required'),
  orgName: yup.string().required('Name is required').max(200),
  isApproved: yup.boolean(),
  imageUrl: yup.string().url(),
  orgUrl: yup
    .string()
    .url('URL format is https://example.com')
    .required('Website is required')
    .max(200),
  email: yup.string().email().required('email is required').max(200),
  description: yup.string().required('Description is required'),
});

export default EditOrgSchema;
