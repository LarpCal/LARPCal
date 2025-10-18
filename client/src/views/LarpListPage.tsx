import LarpList from "../components/Events/LarpList";
import ToastMessage from "../components/ui/ToastMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useFetchLarps } from "../hooks/useFetchLarps";
import { useSearchParams } from "react-router-dom";

function LarpListPage() {
  const [searchParams] = useSearchParams();
  const _queryParam = searchParams.get("q") || null;

  const { larps, loading, error } = useFetchLarps({}, true);

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      {error?.message && (
        <ToastMessage
          title="Sorry, there was a problem fetching records for this page"
          messages={error.message}
        />
      )}
      <LarpList larps={larps} />
    </>
  );
}

export default LarpListPage;
