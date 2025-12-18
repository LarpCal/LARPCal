import { Navigate, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { useFetchOrg } from "../hooks/useFetchOrg";
import { OrganizationForUpdate } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { OrgFormProvider } from "../context/OrgFormProvider";
import OrgForm from "../components/Forms/OrgForm";
import { Alert, Box, Modal } from "@mui/material";
import EditOrgSchema from "../components/Forms/EditOrgSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../components/ui/ToastMessage";
import { TextLink } from "../components/ui/TextLink";
import { useIdParam } from "../hooks/useIdParam";

function EditOrgPage() {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;
  const id = useIdParam();
  const { org, error, loading } = useFetchOrg(id);
  const [saving, setSaving] = useState(false);
  const [saveErrs, setSaveErrs] = useState<string[]>([]);
  const navigate = useNavigate();

  if (loading || !org) {
    return <LoadingSpinner />;
  }

  const orgForUpdate = {
    id: org.id,
    orgName: org.orgName,
    orgUrl: org.orgUrl,
    description: org.description,
    email: org.email,
    imgSetId: org.imgSetId,
    imgUrl: org.imgUrl,
  } satisfies OrganizationForUpdate;

  /** Auth check --> Is this the user's Organization
   * Note that this check allows edits to organizer data prior to
   * account approval by admins.
   */
  if (org && username !== org?.username && !isAdmin) {
    return <Navigate to={`/orgs/${id}`} />;
  }

  async function saveOrg(formData: OrganizationForUpdate) {
    try {
      setSaving(true);
      const savedOrg = await LarpAPI.UpdateOrg({
        ...formData,
      });
      navigate(`/orgs/${savedOrg.id}`);
    } catch (e: unknown) {
      setSaving(false);
      console.error(e);
      if (Array.isArray(e)) {
        setSaveErrs(e);
      }
    }
  }

  return (
    <>
      <ToastMessage
        title="Sorry, there was a problem loading your data"
        messages={error}
      />
      <ToastMessage
        title="Sorry, there was a problem submitting the form"
        messages={saveErrs}
      />
      {saving && (
        <Modal open={true}>
          <Box className="LoadingSpinnerContainer">
            <LoadingSpinner />
          </Box>
        </Modal>
      )}
      {!org?.isApproved && (
        <Alert severity="success" icon={<FontAwesomeIcon icon={faCheck} />}>
          Your application is currently being reviewed by our admin team. Once
          your application has been approved you will be able to publish LARPs.
          Send questions to{" "}
          <TextLink to="mailto:info@larpcalendar.com">
            info@larpcalendar.com
          </TextLink>
        </Alert>
      )}
      <OrgFormProvider<OrganizationForUpdate>
        onSubmitCallback={saveOrg}
        org={orgForUpdate}
        schema={EditOrgSchema}
      >
        <OrgForm />
      </OrgFormProvider>
    </>
  );
}

export default EditOrgPage;
