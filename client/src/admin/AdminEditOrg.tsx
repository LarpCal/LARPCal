import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Modal, Box } from "@mui/material";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import LarpAPI from "../util/api";
import { OrganizationForUpdate } from "../types";

import { OrgFormProvider } from "../context/OrgFormProvider";
import { useFetchOrg } from "../hooks/useFetchOrg";
import EditOrgSchema from "../components/Forms/EditOrgSchema";
import OrgForm from "../components/Forms/OrgForm";
import ToastMessage from "../components/ui/ToastMessage";

function AdminEditOrg() {
  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to edit a larp");
  }

  const [saving, setSaving] = useState(false);
  const [saveErrs, setSaveErrs] = useState<string[]>([]);
  const navigate = useNavigate();
  const { org, setOrg, loading, error } = useFetchOrg(parseInt(id));

  /** Convert data to maintain type safety */
  function orgToOrgForUpdate(): OrganizationForUpdate | null {
    if (org) {
      const { larps: _larps, isApproved: _isApproved, ...orgForUpdate } = org;
      return orgForUpdate;
    }
    return null;
  }
  const orgForUpdate = orgToOrgForUpdate();

  /** Sends an API request to store a larp based on the current form values
   * Navigates to the larpDetail view upon success.
   */
  async function saveOrg(formData: OrganizationForUpdate) {
    try {
      setSaving(true);
      const savedOrg = await LarpAPI.UpdateOrg({
        ...formData,
      });
      setOrg(savedOrg);
      setSaving(false);
      navigate(`/admin/orgs/${org!.id}`);
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

export default AdminEditOrg;
