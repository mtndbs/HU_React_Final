import { createTheme, PaletteMode, ThemeProvider } from "@mui/material";

// const [mode, setMode] = React.useState<'light' | 'dark'>('light');

export const palette = {
  primary: { main: "#1822A5" },
  secondary: { main: "#1c98cc" },
  light: { main: "#4cdede" },
  background: { paper: "#fff", default: "#f5f5f5" },
  special: { main: "#d4af37" },
};

const darkPalette = {
  primary: { main: "#fffff" },
  secondary: { main: "#1c98cc" },
  light: { main: "#878383" },
  background: { paper: "#1b1b1b", default: "#1b1b1b" },
  special: { main: "#d4af37" },
};

function AppThemeProvider({ children, mode }: any) {
  const getDesignTokens = (mode: PaletteMode): any => ({
    mode,
    ...(mode === "light" ? palette : darkPalette),
  });

  const theme = createTheme({
    palette: getDesignTokens(mode),
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            width: "100%",
            margin: 2,
          },
        },
      },
      MuiContainer: {
        styleOverrides: {
          root: {
            marginLeft: "0",
          },
        },
      },
    },
    typography: {
      h1: {
        fontSize: "3.8rem",
        fontWeight: 700,
      },
      h2: {
        fontSize: "2.5rem",
        fontWeight: 700,
      },
      h3: {
        fontSize: "1.4rem",
      },
      h4: {
        fontSize: "1.2rem",
      },
    },
  });

  return <ThemeProvider theme={theme}>{children}</ThemeProvider>;
}

export default AppThemeProvider;

//need to be fixed
