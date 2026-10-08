import { useNavigate, useParams } from "react-router-dom";

import { Box, Modal } from "@mui/material";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EventForm from "../components/Forms/LarpForm";
import LarpAPI from "../util/api";
import { LarpForUpdate } from "../types";

import { LarpFormProvider } from "../context/LarpFormProvider";
import { useFetchLarp } from "../hooks/useFetchLarp";
import ToastMessage from "../components/ui/ToastMessage";
import { useMutation } from "@tanstack/react-query";

function AdminEditLarp() {
  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to edit a larp");
  }

  const navigate = useNavigate();
  const { larp, loading, error } = useFetchLarp(parseInt(id));

  /** Type conversion. Schema prevents a simple cast from working. */
  function larpToLarpForUpdate(): LarpForUpdate | null {
    if (larp) {
      const {
        orgId: _orgId,
        organization: _organization,
        ...larpForUpdate
      } = larp;
      return larpForUpdate;
    }
    return null;
  }
  const larpForUpdate = larpToLarpForUpdate();

  /** Sends an API request to store a larp based on the current form values
   * Navigates to the larpDetail view upon success.
   */
  const { isPending, mutateAsync } = useMutation({
    async mutationFn(formData: LarpForUpdate) {
      const savedLarp = await LarpAPI.UpdateLarp(formData);
      navigate(`/admin/events/${savedLarp.id}`);
    },
  });

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <ToastMessage
        title="Sorry, there was a problem loading your data"
        messages={error}
      />
      <ToastMessage
        title="Sorry, there was a problem submitting the form"
        messages={error}
      />
      {isPending && (
        <Modal open={true}>
          <Box className="LoadingSpinnerContainer">
            <LoadingSpinner />
          </Box>
        </Modal>
      )}
      <LarpFormProvider<LarpForUpdate>
        onSubmitCallback={mutateAsync}
        larp={larpForUpdate!}
      >
        <EventForm />
      </LarpFormProvider>
    </>
  );
}

export default AdminEditLarp;
