import { createTheme } from "@mui/material";

declare module "@mui/material/styles/createPalette" {
  interface PaletteOptions {
    dark?: PaletteColorOptions;
  }
  interface Palette {
    dark: PaletteColor;
  }
}

const theme = createTheme({
  palette: {
    primary: {
      main: "#743c55", //'#D4EC41',
      light: "#af8e9f", //'#F0FE9E',
      dark: "#3e0f23",
      contrastText: "#ffffff",
    },
    success: {
      main: "#4caf50",
      light: "#F0FE9E",
      dark: "#A0C732",
      contrastText: "#070707",
    },
    warning: {
      main: "#ed6c02",
      light: "#ff9800",
      dark: "#e65100",
      contrastText: "#070707",
    },
    error: {
      main: "#d32f2f",
      light: "#ef5350",
      dark: "#c62828",
      contrastText: "white",
    },
    dark: {
      main: "#070707",
      light: "#0f0f0f",
      dark: "#000000",
      contrastText: "white",
    },
  },
  typography: {
    fontFamily: ["Karla", " sans-serif"].join(","),
    button: { textTransform: "none" },
    h1: {
      fontFamily: `"Karla", sans-serif;`,
      fontSize: `1.5rem`,
      "@media (min-width:600px)": { fontSize: "2rem" },
      "@media (min-width:900px)": { fontSize: "2.5rem" },
      "@media (min-width:1200px)": { fontSize: "3rem" },
      fontWeight: "900",
    },
    h3: {
      fontFamily: `"Karla", sans-serif`,
      fontSize: "1.25rem",
      fontWeight: "600",
      "@media (min-width:600px)": { fontSize: "1.75rem" },
      "@media (min-width:900px)": { fontSize: "2.5rem" },
      "@media (min-width:1200px)": { fontSize: "3rem" },
    },
    h2: {
      fontFamily: `"Karla", sans-serif`,
      fontSize: `1.25rem`,
      fontWeight: "900",
      padding: "1rem",
      paddingLeft: "0",
      "@media (min-width:600px)": { fontSize: "1.5rem" },
      "@media (min-width:900px)": { fontSize: "2rem" },
      "@media (min-width:1200px)": { fontSize: "2.5rem" },
    },
    h4: {
      fontFamily: `"Karla", sans-serif`,
      fontSize: "1.25rem",
      fontWeight: "700",
      paddingLeft: "0",
      "@media (min-width:600px)": { fontSize: "1.25rem" },
      "@media (min-width:900px)": { fontSize: "1.5rem" },
      "@media (min-width:1200px)": { fontSize: "1.5rem" },
    },
    h5: {
      fontFamily: `"Karla", sans-serif`,
      fontSize: "1.25rem",
      fontWeight: "700",
      paddingLeft: "0",
      "@media (min-width:600px)": { fontSize: "1.25rem" },
      "@media (min-width:900px)": { fontSize: "1.25rem" },
      "@media (min-width:1200px)": { fontSize: "1.25rem" },
    },
    subtitle1: { fontWeight: 300, fontStyle: "italic" },
    body1: {
      fontSize: ".75rem",
      "@media (min-width:600px)": {
        fontSize: "1rem",
      },
    },
    body2: {
      fontSize: ".6rem",
      "@media (min-width:600px)": { fontSize: ".75rem" },
    },
    details1: {
      fontSize: 14,
      fontWeight: 500,
    },
    details2: {
      fontSize: 10,
    },
  },
  components: {
    MuiMenu: {
      defaultProps: { elevation: 0 },
    },
  },
});

export default theme;
