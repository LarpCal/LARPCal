import { useContext } from "react";
import { userContext } from "./context/userContext";
import { BrowserRouter } from "react-router-dom";
import ScrollToTop from "./components/ui/ScrollToTop";
import NavBar from "./components/NavBar";
import RoutesList from "./RoutesList";
import Footer from "./components/Footer";
import { Box, Typography } from "@mui/material";
import LoadingSpinner from "./components/ui/LoadingSpinner";

export default function AppContent() {
  const { loading, error } = useContext(userContext);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <Box className="App">
        <BrowserRouter>
          <NavBar />
          <Box className="App-page">
            <Box className="App-errors">
              <Typography variant="h2">
                Sorry, we had trouble loading the page
              </Typography>
              <Typography variant="body1" color="charcoal">
                {error}
              </Typography>
            </Box>
          </Box>
        </BrowserRouter>
      </Box>
    );
  }

  return (
    <BrowserRouter>
      <ScrollToTop />
      <NavBar />
      <RoutesList />
      <Footer />
    </BrowserRouter>
  );
}
