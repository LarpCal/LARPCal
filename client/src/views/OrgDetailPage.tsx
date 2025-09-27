import { Link as RouterLink, useParams } from "react-router-dom";
import { useFetchOrg } from "../hooks/useFetchOrg";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import OrgDetails from "../components/Orgs/OrgDetails";
import { Alert } from "@mui/material";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCheck } from "@fortawesome/free-solid-svg-icons";
import { Link } from "@mui/material";
import ToastMessage from "../components/ui/ToastMessage";

function OrgDetailPage() {
  const { id } = useParams();
  if (!id) {
    throw new Error("Id is required to view details page for an organization");
  }

  const { org, error, loading } = useFetchOrg(+id);

  if (org)
    return loading ? (
      <LoadingSpinner />
    ) : (
      <>
        <ToastMessage
          title="Sorry, there was a problem fetching this record"
          messages={error}
        />
        {!org.isApproved && (
          <Alert severity="success" icon={<FontAwesomeIcon icon={faCheck} />}>
            Your application is currently being reviewed by our admin team. Once
            your application has been approved you will be able to publish
            events. Send questions to{" "}
            <Link component={RouterLink} to="mailto:info@larpcalendar.com">
              info@larpcalendar.com
            </Link>
          </Alert>
        )}
        <OrgDetails org={org} />
      </>
    );
}

export default OrgDetailPage;
