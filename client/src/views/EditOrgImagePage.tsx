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
import { useFetchOrg } from "../hooks/useFetchOrg";
import ImageForm from "../components/Forms/EditImageForm";
import ToastMessage from "../components/ui/ToastMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";

function EditOrgImagePage() {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);

  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to edit an organization");
  }

  const location = useLocation();
  const newOrg = new URLSearchParams(location.search).get("new");

  const { org, loading, error: fetchError } = useFetchOrg(parseInt(id));
  const navigate = useNavigate();

  //TODO: move auth checks to custom hook
  if (!loading && username !== org?.username && !isAdmin) {
    console.log(org);
    console.log(username, org?.username);
    console.error("You are not authorized to edit this record");
    return <Navigate to={`/orgs/${id}`} />;
  }

  async function handleSubmit(image: Blob, id: number) {
    try {
      setSaving(true);
      await LarpAPI.updateOrgImage(image, id);
      navigate(`/orgs/${id}`);
    } catch (e: any) {
      setErrs(e);
      setSaving(false);
    }
  }

  return (
    <>
      <ToastMessage
        title="Sorry, there was a problem fetching this record"
        messages={fetchError}
      />
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
      <Stack direction={"column"} alignItems={"center"} spacing={3}>
        <Box
          sx={{
            padding: "1rem",
            paddingTop: "3rem",
            textAlign: "center",
          }}
        >
          <Typography variant={"h1"} component={"h2"}>
            {newOrg ? "You're almost done" : "Add an event banner"}
          </Typography>
          <Typography>
            Upload an image for your event using the form below
          </Typography>
        </Box>
        {org && <ImageForm model={org} submitCallback={handleSubmit} />}
      </Stack>
    </>
  );
}

export default EditOrgImagePage;
