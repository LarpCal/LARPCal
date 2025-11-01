import LarpList from "../components/Events/LarpList";
import ToastMessage from "../components/ui/ToastMessage";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { useFetchLarps } from "../hooks/useFetchLarps";
import { useSearchQuery } from "../hooks/useSearchQuery";

function LarpListPage() {
  const queryParams = useSearchQuery();

  const { larps, loading, error } = useFetchLarps(queryParams, true);

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
