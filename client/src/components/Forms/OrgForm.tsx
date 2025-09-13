import { Organization } from '../../types';
import { useFormikContext, Form } from 'formik';
import { FastField } from 'formik';
import { Box, Button, Stack, Typography } from '@mui/material';
import FormikMuiTextField from '../FormComponents/FormikMuiTextField';
import ErrorDisplay from '../FormComponents/ErrorDisplay';

function OrgForm() {
  const { isValid, errors } = useFormikContext<Organization>();
  const errorMessage = `
        Please check following fields to continue:
        ${Object.keys(errors)
          .map((key) => {
            return key !== 'steps' ? key : null;
          })
          .join(', ')}
    `;

  return (
    <>
      <Box
        className="RecipeForm"
        sx={{
          width: '100%',
        }}
      >
        <Form>
          <Stack direction="column" spacing={2} sx={{ margin: '1rem' }}>
            <FastField
              component={FormikMuiTextField}
              placeholder="Name your event"
              name="orgName"
              id="orgName"
              label="Organization Name"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="https://example.com"
              name="orgUrl"
              id="orgUrl"
              label="Website"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="email"
              name="email"
              id="email"
              label="email"
              fullWidth
            />
            <FastField
              component={FormikMuiTextField}
              placeholder="Add a description for your organization"
              name="description"
              id="description"
              label="Description"
              fullWidth
              multiline
              minRows={3}
              maxRows={10}
            />

            <Box className="submitButton">
              <Stack direction="row" alignContent="center" spacing={2}>
                {!isValid && <ErrorDisplay message={errorMessage} />}

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  disabled={isValid ? false : true}
                >
                  <Typography variant="h5">Save Changes</Typography>
                </Button>
              </Stack>
            </Box>
          </Stack>
        </Form>
      </Box>
    </>
  );
}

export default OrgForm;
