import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/ui/LoadingSpinner";
import { Box, Typography } from "@mui/material";

type props = {
  logOut: () => void;
};

function LogOutPage({ logOut }: props) {
  const navigate = useNavigate();

  useEffect(
    function NavigateOnMount() {
      console.log("logging out");
      logOut();
      navigate("/");
    },
    [logOut, navigate],
  );

  return (
    <Box>
      <LoadingSpinner />
      <Typography>Logging out...</Typography>
    </Box>
  );
}

export default LogOutPage;
