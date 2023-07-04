import * as React from "react";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
import { Container } from "@mui/material";
import { removeUser, verifyToken, verifyUiAdmin, verifyUiToken } from "./../../auth/TokenManager";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import { UserContext } from "../../hooks/UserContext";
import { green } from "@mui/material/colors";
import { palette } from "../../plugins/mui";

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function NavTabs() {
  const [value, setValue] = React.useState(0);
  const { userData } = React.useContext(UserContext);
  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Container
      sx={{
        display: "flex",
        px: 2,
        alignItems: "center",
        justifyContent: "space-between",
        height: { xs: 55, md: 75 },
      }}
    >
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        <Tabs indicatorColor="secondary" textColor="secondary" value={value} onChange={handleChange}>
          <Tab label="Home" to="/" sx={{ color: "white" }} component={Link} {...a11yProps(0)} />
          <Tab label="About" to="/about" sx={{ color: "white" }} component={Link} {...a11yProps(1)} />

          {userData?.bizChecked || verifyUiAdmin(userData!) ? (
            <Tab label="My Cards" to="/my-cards" sx={{ color: "white" }} component={Link} {...a11yProps(2)} />
          ) : (
            <span></span>
          )}

          {verifyUiToken(userData!) && (
            <Tab label="My Favorite" to="/favorite-card" sx={{ color: "white" }} component={Link} {...a11yProps(3)} />
          )}
        </Tabs>
      </Box>
      <Box sx={{ display: { xs: "none", md: "flex" } }}>
        {verifyUiAdmin(userData!) && (
          <Tab
            label="Admin"
            to="/sandbox"
            sx={{ color: palette.special.main, opacity: 1 }}
            icon={<AdminPanelSettingsIcon sx={{ color: palette.special.main }} />}
            component={Link}
            {...a11yProps(3)}
          />
        )}
        <Tab label="SignUp" to="/sign" sx={{ opacity: 1, color: !verifyToken() ? green[200] : "white" }} component={Link} />
        {!userData?.role && <Tab label="Login" to="/login" sx={{ opacity: 1 }} component={Link} />}
        {verifyToken() && (
          <Tab
            label="LOG OUT"
            sx={{ color: "white" }}
            onClick={() => {
              removeUser();
            }}
            {...a11yProps(0)}
          />
        )}
      </Box>
    </Container>
  );
}
