import { Formik } from "formik";
import { useNavigate } from "react-router-dom";
import { LarpQuery } from "../../types";
import FilterLarpSchema from "./FilterLarpSchema";
import FilterLarpsFormFields from "./FilterLarpsFormFields";
import { larpQueryToSearchParams } from "../../util/utilities";
import { useSearchQuery } from "../../hooks/useSearchQuery";
import { useCallback, useMemo } from "react";

type FilterLarpsFormProps = {
  onSubmitCallback: () => void;
};

function FilterLarpsForm({ onSubmitCallback }: FilterLarpsFormProps) {
  const queryObj = useSearchQuery();
  const navigate = useNavigate();

  const setFilters = useCallback(
    (filterFormData: LarpQuery) => {
      //remove empty entries
      const reducedFormData: LarpQuery = {};
      Object.keys(filterFormData).forEach((key) => {
        const typedKey = key as keyof LarpQuery;
        const value = filterFormData[typedKey];

        if (typedKey === "isFeatured" || typedKey === "isPublished") {
          reducedFormData[typedKey] = !!value;
        } else if (typedKey === "ticketStatus") {
          if (
            value === "AVAILABLE" ||
            value === "LIMITED" ||
            value === "SOLD_OUT" ||
            value === ""
          ) {
            reducedFormData[typedKey] = value;
          }
        } else if (typedKey === "orgId") {
          if (value && typeof value === "number") {
            reducedFormData[typedKey] = value;
          }
        } else if (typeof value === "string" && value.trim() !== "") {
          reducedFormData[typedKey] = value;
        }
      });

      navigate(`/events/?${larpQueryToSearchParams(reducedFormData)}`);
    },
    [navigate],
  );

  const initialFormValues: LarpQuery = useMemo(() => {
    return {
      term: queryObj.term || "",
      title: queryObj.title || "",
      ticketStatus: queryObj.ticketStatus || "",
      tags: queryObj.tags || "",
      startBefore: queryObj.startBefore || "",
      startAfter: queryObj.startAfter || "",
      endBefore: queryObj.endBefore || "",
      endAfter: queryObj.endAfter || "",
      city: queryObj.city || "",
      country: queryObj.country || "",
      language: queryObj.language || "",
      org: queryObj.org || "",
    };
  }, [queryObj]);

  return (
    <>
      <Formik
        onSubmit={(values) => {
          onSubmitCallback();
          setFilters(values);
        }}
        initialValues={initialFormValues}
        validationSchema={FilterLarpSchema}
      >
        <FilterLarpsFormFields />
      </Formik>
    </>
  );
}

export default FilterLarpsForm;
