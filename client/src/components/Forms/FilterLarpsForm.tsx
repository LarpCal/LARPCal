import { Formik } from 'formik';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LarpQuery } from '../../types';
import FilterLarpSchema from './FilterLarpSchema';
import FilterLarpsFormFields from './FilterLarpsFormFields';
import { base64Decode, base64Encode } from '../../util/utilities';
import { useCallback, useMemo } from 'react';

type FilterLarpsFormProps = {
  onSubmitCallback: () => void;
};

function FilterLarpsForm({ onSubmitCallback }: FilterLarpsFormProps) {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('q') || null;
  const navigate = useNavigate();

  const setFilters = useCallback(
    (filterFormData: LarpQuery) => {
      //remove empty entries
      const reducedFormData: LarpQuery = {};
      Object.keys(filterFormData).forEach((key) => {
        const typedKey = key as keyof LarpQuery;
        const value = filterFormData[typedKey];

        if (typedKey === 'isFeatured' || typedKey === 'isPublished') {
          if (typeof value === 'boolean') reducedFormData[typedKey] = value;
        } else if (typedKey === 'ticketStatus') {
          if (
            value === 'AVAILABLE' ||
            value === 'LIMITED' ||
            value === 'SOLD_OUT' ||
            value === ''
          ) {
            reducedFormData[typedKey] = value as LarpQuery[typeof typedKey];
          }
        } else if (value !== null && value !== undefined && value !== '') {
          reducedFormData[typedKey] = value as LarpQuery[typeof typedKey];
        }
      });

      //encode values for query
      const query = base64Encode(JSON.stringify(reducedFormData));
      navigate(`/events/?q=${query}`);
    },
    [navigate],
  );

  const initialFormValues: LarpQuery = useMemo(() => {
    const queryObj: LarpQuery = queryParam
      ? JSON.parse(base64Decode(queryParam))
      : {};
    return {
      term: queryObj.term || '',
      title: queryObj.title || '',
      ticketStatus: queryObj.ticketStatus || '',
      tags: queryObj.tags || '',
      startBefore: queryObj.startBefore || '',
      startAfter: queryObj.startAfter || '',
      endBefore: queryObj.endBefore || '',
      endAfter: queryObj.endAfter || '',
      city: queryObj.city || '',
      country: queryObj.country || '',
      language: queryObj.language || '',
      org: queryObj.org || '',
    };
  }, [queryParam]);

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
