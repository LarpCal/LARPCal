import { useContext, useState } from 'react';
import { useNavigate } from 'react-router-dom';

import EventForm from '../components/Forms/LarpForm';
import LarpAPI from '../util/api';
import { LarpForCreate } from '../types';

import { LarpFormProvider } from '../context/LarpFormProvider';
import { userContext } from '../context/userContext';
import ToastMessage from '../components/ui/ToastMessage';
import { Box, Modal } from '@mui/material';
import LoadingSpinner from '../components/ui/LoadingSpinner';

type NewLarpPageProps = {
  initialLarp?: LarpForCreate;
};

const emptyLarp: LarpForCreate = {
  title: '',
  ticketStatus: 'AVAILABLE',
  tags: [],
  start: new Date(),
  end: new Date(Date.now() + 60 * 60 * 1000),
  allDay: false,
  city: '',
  country: '',
  language: '',
  description: '',
  orgId: 0,
  eventUrl: '',
};

function NewLarpPage({ initialLarp = emptyLarp }: NewLarpPageProps) {
  const { user } = useContext(userContext);
  const { organization } = user;
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);
  const navigate = useNavigate();

  console.log(organization);

  /** Sends an API request to store a larp based on the current form values
   * Navigates to the larpDetail view upon success.
   */
  async function saveLarp(formData: LarpForCreate) {
    try {
      setSaving(true);
      const savedLarp = await LarpAPI.createLarp({
        ...formData,
        orgId: organization!.id,
      });

      if (organization?.isApproved) {
        await LarpAPI.publishLarp(savedLarp.id);
        savedLarp.isPublished = true;
      }
      navigate(`/events/${savedLarp.id}/image?new=true`);
    } catch (e: any) {
      setErrs(e);
      setSaving(false);
    }
  }

  return (
    <>
      <ToastMessage
        title="Sorry, there was a problem submitting the form"
        messages={errs}
      />
      {saving && (
        <Modal open={true}>
          <Box className="LoadingSpinnerContainer">
            <LoadingSpinner />
          </Box>
        </Modal>
      )}
      <LarpFormProvider<LarpForCreate>
        onSubmitCallback={saveLarp}
        larp={initialLarp}
      >
        <EventForm />
      </LarpFormProvider>
    </>
  );
}

export default NewLarpPage;
