import { useState, useContext } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { Modal, Box } from "@mui/material";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import EventForm from "../components/Forms/LarpForm";
import LarpAPI from "../util/api";
import { Larp, LarpForUpdate } from "../types";

import { LarpFormProvider } from "../context/LarpFormProvider";
import { userContext } from "../context/userContext";
import { useFetchLarp } from "../hooks/useFetchLarp";
import ErrorMessage from "../components/ui/ErrorMessage";

function AdminEditLarp() {
    const { id } = useParams();
    if (!id) {
        throw new Error("Id is required to edit a larp");
    }

    const [saving, setSaving] = useState(false);
    const [saveErrs, setSaveErrs] = useState<string[]>([]);
    const navigate = useNavigate();
    const { organization } = useContext(userContext);
    const { larp, setLarp, loading, error } = useFetchLarp(parseInt(id));

    /** Type conversion. Schema prevents a simple cast from working. */
    function larpToLarpForUpdate():LarpForUpdate | null{
        if (larp){
            const {orgId:_orgId, organization:_organization, ...larpForUpdate} = larp;
            return larpForUpdate
        }
        return null;
    }
    const larpForUpdate=larpToLarpForUpdate();

    /** Sends an API request to store a larp based on the current form values
  * Navigates to the larpDetail view upon success.
  */
    async function saveLarp(formData: Larp) {
        try {
            setSaving(true);
            const savedLarp = await LarpAPI.UpdateLarp({
                ...formData,
                orgId: organization!.id,
            });
            setLarp(savedLarp);
            setSaving(false);
            navigate(`/admin/events/${savedLarp.id}`);
        } catch (e: any) {
            setSaving(false);
            console.error(e);
            setSaveErrs(() => [...e]);
        }

    }

    return (
        loading
            ?
            <LoadingSpinner />
            :
            <>
                <ErrorMessage
                    title="Sorry, there was a problem loading your data"
                    errs={error}
                />
                <ErrorMessage
                    title="Sorry, there was a problem submitting the form"
                    errs={saveErrs}
                />
                {saving &&
                    <Modal open={true}>
                        <Box className="LoadingSpinnerContainer">
                            <LoadingSpinner />
                        </Box>
                    </Modal>
                }
                <LarpFormProvider<Larp> onSubmitCallback={saveLarp} larp={larpForUpdate!}>
                    <EventForm />
                </LarpFormProvider>
            </>
    );
}

export default AdminEditLarp;