import { useContext, useState } from "react";
import LarpAPI from "../util/api";
import { Navigate, useNavigate } from "react-router-dom";
import { OrganizationForCreate } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { OrgFormProvider } from "../context/OrgFormProvider";
import { Box, Modal, Typography } from "@mui/material";
import { userContext } from "../context/userContext";
import OrgForm from "../components/Forms/OrgForm";
import CreateOrgSchema from "../components/Forms/CreateOrgSchema";
import ToastMessage from "../components/ui/ToastMessage";

function CreateOrgPage() {
  const { user, setUser } = useContext(userContext);
  const [saving, setSaving] = useState(false);
  const [errs, setErrs] = useState<string[]>([]);
  const navigate = useNavigate();

  if (!user.username) {
    return <Navigate to="/auth/login" />;
  }
  if (user.organization) {
    return <Navigate to={`/orgs/${user.organization.id}/edit`} />;
  }

  const EMPTY_ORG: OrganizationForCreate = {
    orgName: "",
    orgUrl: "",
    description: "",
    email: "",
    username: user.username,
  };

  async function saveOrg(formData: OrganizationForCreate) {
    try {
      setSaving(true);
      const savedOrg = await LarpAPI.CreateOrganization({
        ...formData,
      });
      setUser({
        ...user,
        organization: savedOrg,
      });
      await LarpAPI.refreshToken();
      navigate(`/orgs/${savedOrg.id}/image`);
    } catch (e: unknown) {
      if (Array.isArray(e)) {
        setErrs(e);
      }
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
      <Typography component="h1" variant="h1" m="2rem">
        Become an organizer
      </Typography>
      <Typography m="2rem">
        Would you like to add your events to the calendar? We'd love to have
        you! Fill out the form below and our team will review your application.
        Once you're approved, you'll be able to post your own events.
      </Typography>
      <OrgFormProvider<OrganizationForCreate>
        onSubmitCallback={saveOrg}
        org={EMPTY_ORG}
        schema={CreateOrgSchema}
      >
        <OrgForm />
      </OrgFormProvider>
    </>
  );
}

export default CreateOrgPage;
