import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useState } from 'react';
import { UserForCreate } from '../../types';

import FormikMuiTextField from '../FormComponents/FormikMuiTextField';
import { Formik, FastField, Form } from 'formik';

import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';

import userRegistrationSchema from './userRegistrationSchema';
// import "./userRegistrationForm.scss";

type UserRegistrationData = {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
};

const DEFAULT_FORM_DATA: UserRegistrationData = {
  email: '',
  username: '',
  password: '',
  confirmPassword: '',
};

type props = {
  register: (userInfo: UserForCreate) => Promise<void>;
};

function UserRegistrationForm({ register }: props) {
  const navigate = useNavigate();
  const [_error, setError] = useState<string | null>(null);

  async function registerUser(values: UserRegistrationData) {
    try {
      await register({
        username: values.username,
        password: values.password,
        email: values.email,
        firstName: '',
        lastName: '',
      });
      setError(null);
      navigate('/welcome');
    } catch (errs: any) {
      console.log('errors: ', errs[0]);
      setError(errs[0]);
    }
  }

  return (
    <Formik
      initialValues={DEFAULT_FORM_DATA}
      onSubmit={async (values) => await registerUser(values)}
      validationSchema={userRegistrationSchema}
    >
      {({ isValid }) => (
        <Form className="RegistrationForm">
          <Stack direction="column" spacing={2}>
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              id={`username`}
              label="username"
              name={`username`}
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              type="password"
              id={`password`}
              label="password"
              name={`password`}
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              type="password"
              id={`confirmPassword`}
              label="confirm password"
              name={`confirmPassword`}
            />
            <FastField
              component={FormikMuiTextField}
              variant="outlined"
              size="small"
              id={`email`}
              label="email"
              name={`email`}
            />
            <Button
              type="submit"
              variant="contained"
              color="primary"
              disabled={isValid ? false : true}
            >
              {' '}
              Sign Up{' '}
            </Button>
            <Typography component="p" variant="caption" align="center">
              Already Registered?<Link to="/LogIn"> Log In</Link>
            </Typography>
            {/* {error && <ErrorDisplay message={error}/>} */}
          </Stack>
        </Form>
      )}
    </Formik>
  );
}

export default UserRegistrationForm;
