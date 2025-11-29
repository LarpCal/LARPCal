import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Box, Typography } from "@mui/material";
import { useUser } from "../hooks/useUser";

export default function LogOutPage() {
  const { logout } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    logout();
    navigate("/");
  }, [logout, navigate]);

  return (
    <Box>
      <LoadingSpinner />
      <Typography>Logging out...</Typography>
    </Box>
  );
}
