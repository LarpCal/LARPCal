import { Box, IconButton, Typography } from '@mui/material';
import { DataGrid, GridColDef, GridRowsProp } from '@mui/x-data-grid';

import LarpAPI from '../util/api';
import DeleteButton from '../components/FormComponents/DeleteButton';
import EditButton from '../components/FormComponents/EditButton';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import { Link } from '@mui/material';
import { useFetchOrgs } from '../hooks/useFetchOrgs';
import ApproveButton from '../components/FormComponents/ApproveButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import ToastMessage from '../components/ui/ToastMessage';
import LoadingSpinner from '../components/ui/LoadingSpinner';

function OrgsDashboard() {
  const { orgs, setOrgs, loading, error } = useFetchOrgs();
  const navigate = useNavigate();

  async function handleDelete(id: number) {
    await LarpAPI.DeleteOrg(id);
    setOrgs(() => orgs.filter((org) => org.id !== id));
  }

  async function handleApprove(id: number, isApproved: boolean) {
    const updatedOrg = await LarpAPI.UpdateOrgApproval(id, isApproved);
    setOrgs(() => {
      return orgs.map((org) => (org.id === id ? updatedOrg : org));
    });
  }

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'Id', width: 50 },
    {
      field: 'orgName',
      headerName: 'Name',
      flex: 1,
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`/admin/orgs/${params.row.id}`}>
            {params.row.orgName}
          </Link>
        );
      },
    },
    {
      field: 'username',
      headerName: 'Account',
    },
    {
      field: 'email',
      headerName: 'email',
      flex: 1,
      renderCell: (params) => {
        return (
          <Link component={RouterLink} to={`mailto:${params.row.email}`}>
            {params.row.email}
          </Link>
        );
      },
    },
    {
      field: 'isApproved',
      headerName: 'Status',
      align: 'center',
      renderCell: (params) => {
        return params.row.isApproved ? (
          <Typography variant="details1" color="success.main">
            {' '}
            Approved{' '}
          </Typography>
        ) : (
          <Typography variant="details1" color="error.main">
            {' '}
            Not Approved{' '}
          </Typography>
        );
      },
    },
    {
      field: 'actions',
      headerName: 'Actions',
      type: 'actions',
      width: 200,
      getActions: (params) => {
        if (params.row.id === 1) {
          return [
            <IconButton disabled>
              <FontAwesomeIcon icon={faTrash} />
            </IconButton>,
            <EditButton
              handleClick={() => navigate(`/admin/orgs/${params.row.id}/edit`)}
            />,
            <ApproveButton
              handleClick={() =>
                handleApprove(params.row.id, !params.row.isApproved)
              }
            />,
          ];
        }

        return [
          <DeleteButton handleDelete={() => handleDelete(params.row.id)} />,
          <EditButton handleClick={() => navigate(`${params.row.id}/edit`)} />,
          <ApproveButton
            handleClick={() =>
              handleApprove(params.row.id, !params.row.isApproved)
            }
          />,
        ];
      },
    },
  ];

  const rows: GridRowsProp = orgs.map((org) => ({
    ...org,
  }));

  return loading ? (
    <LoadingSpinner />
  ) : (
    <>
      <ToastMessage
        title="Sorry, there was a problem loading your data"
        messages={error}
      />
      <Box
        sx={{
          height: '85dvh',
          width: '100%',
        }}
      >
        <DataGrid
          columns={columns}
          rows={rows}
          initialState={{
            sorting: {
              sortModel: [
                {
                  field: 'isApproved',
                  sort: 'asc',
                },
              ],
            },
          }}
        />
      </Box>
    </>
  );
}

export default OrgsDashboard;
