import { Navigate, useParams, useNavigate } from "react-router-dom";
import { useContext, useState } from "react";
import { userContext } from "../context/userContext";
import { useFetchOrg } from "../hooks/useFetchOrg";
import { OrganizationForUpdate } from "../types";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { OrgFormProvider } from "../context/OrgFormProvider";
import OrgForm from "../components/Forms/OrgForm";
import { Alert, Box, Link, Modal } from "@mui/material";
import EditOrgSchema from "../components/Forms/EditOrgSchema";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import ToastMessage from "../components/ui/ToastMessage";
import { Link as RouterLink } from "react-router-dom";

function EditOrgPage() {
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;
  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to view details page for an organization");
  }
  const { org, error, loading } = useFetchOrg(+id);
  const [saving, setSaving] = useState(false);
  const [saveErrs, setSaveErrs] = useState<string[]>([]);
  const navigate = useNavigate();

  /** Auth check --> Is this the user's Organization
   * Note that this check allows edits to organizer data prior to
   * account approval by admins.
   */
  if (org && username !== org?.username && !isAdmin) {
    return <Navigate to={`/orgs/${id}`} />;
  }

  /** Convert data to maintain type safety */
  function orgToOrgForUpdate(): OrganizationForUpdate | null {
    if (org) {
      const { larps: _larps, isApproved: _isApproved, ...orgForUpdate } = org;
      return orgForUpdate;
    }
    return null;
  }
  const orgForUpdate = orgToOrgForUpdate();

  async function saveOrg(formData: OrganizationForUpdate) {
    try {
      setSaving(true);
      const savedOrg = await LarpAPI.UpdateOrg({
        ...formData,
      });
      navigate(`/orgs/${savedOrg.id}`);
    } catch (e: any) {
      setSaving(false);
      console.error(e);
      setSaveErrs(() => [...e]);
    }
  }

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
          your application has been approved you will be able to publish events.
          Send questions to{" "}
          <Link component={RouterLink} to="mailto:info@larpcalendar.com">
            info@larpcalendar.com
          </Link>
        </Alert>
      )}
      <OrgFormProvider<OrganizationForUpdate>
        onSubmitCallback={saveOrg}
        org={orgForUpdate!}
        schema={EditOrgSchema}
      >
        <OrgForm />
      </OrgFormProvider>
    </>
  );
}

export default EditOrgPage;
