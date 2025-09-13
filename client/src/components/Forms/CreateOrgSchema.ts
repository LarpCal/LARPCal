import * as yup from 'yup';

const CreateOrgSchema = yup.object({
  username: yup.string().required('Username is required'),
  orgName: yup.string().required('Name is required').max(200),
  // imageUrl: yup.string().url(),
  orgUrl: yup.string().url().required('Website is required').max(200),
  email: yup.string().email().required('email is required').max(200),
  description: yup.string().required('Description is required'),
});

export default CreateOrgSchema;
