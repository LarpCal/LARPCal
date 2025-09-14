import "./App.scss";

import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterLuxon } from "@mui/x-date-pickers/AdapterLuxon";

import { ThemeProvider } from "@mui/material";
import theme from "./styles/theme.tsx";

import AppContent from "./AppContent.tsx";
import UserProvider from "./hooks/UserProvider.tsx";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <LocalizationProvider dateAdapter={AdapterLuxon}>
        <UserProvider>
          <AppContent />
        </UserProvider>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;
