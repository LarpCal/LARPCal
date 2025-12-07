import { useParams } from "react-router-dom";
import LarpDetails from "../components/Events/LarpDetails";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useFetchLarp } from "../hooks/useFetchLarp";
import ToastMessage from "../components/ui/ToastMessage";

function LarpDetailPage() {
  const { id } = useParams();

  if (!id) {
    throw new Error("Id is required in url params to load event details");
  }

  const { larp, loading, error } = useFetchLarp(parseInt(id));

  return (
    <>
      {loading ? (
        <LoadingSpinner />
      ) : (
        <>
          <ToastMessage
            title="Sorry, there was a problem fetching this record"
            messages={error}
          />
          {larp && <LarpDetails larp={larp} />}
        </>
      )}
    </>
  );
}

export default LarpDetailPage;
