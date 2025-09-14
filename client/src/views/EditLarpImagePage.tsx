import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import {
  useParams,
  useNavigate,
  Navigate,
  useLocation,
} from "react-router-dom";
import LarpAPI from "../util/api";
import { Box, Modal, Stack, Typography } from "@mui/material";
import { useFetchLarp } from "../hooks/useFetchLarp";
import ImageForm from "../components/Forms/EditImageForm";
import ToastMessage from "../components/ui/ToastMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function EditLarpImagePage() {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);

  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to edit a larp");
  }

  const location = useLocation();
  const newLarp = new URLSearchParams(location.search).get("new");

  const { larp, loading, error: fetchError } = useFetchLarp(parseInt(id));
  const navigate = useNavigate();

  //TODO: move auth checks to custom hook
  if (!loading && username !== larp?.organization.username && !isAdmin) {
    console.error("You are not authorized to edit this record");
    return <Navigate to={`events/${id}`} />;
  }

  async function handleSubmit(image: Blob, id: number) {
    try {
      setSaving(true);
      await LarpAPI.updateLarpImage(image, id);
      navigate(`/events/${id}`);
    } catch (e: any) {
      setErrs(e);
      setSaving(false);
    }
  }

  return (
    <>
      <ToastMessage
        title="Sorry, there was a problem fetching this record"
        messages={errs}
      />
      <ToastMessage
        title="Sorry, there was a problem submitting the form"
        messages={fetchError}
      />
      {saving && (
        <Modal open={true}>
          <Box className="LoadingSpinnerContainer">
            <LoadingSpinner />
          </Box>
        </Modal>
      )}
      <Stack direction={"column"} alignItems={"center"} spacing={3}>
        <Box
          sx={{
            padding: "1rem",
            paddingTop: "3rem",
            textAlign: "center",
          }}
        >
          <Typography variant={"h1"} component={"h2"}>
            {newLarp ? "You're almost done" : "Add an event banner"}
          </Typography>
          <Typography>
            Upload an image for your event using the form below
          </Typography>
        </Box>
        {larp && <ImageForm model={larp} submitCallback={handleSubmit} />}
      </Stack>
    </>
  );
}

export default EditLarpImagePage;
