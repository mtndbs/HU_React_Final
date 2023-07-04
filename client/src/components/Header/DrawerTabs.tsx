import { Box, Divider, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import AppTitle from "../AppTitle";
import HomeIcon from "@mui/icons-material/Home";
import InfoIcon from "@mui/icons-material/Info";
import PortraitIcon from "@mui/icons-material/Portrait";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import React from "react";
import { verifyUiAdmin, verifyToken } from "../../auth/TokenManager";

function DrawerTabs() {
  const openArr = [
    { title: "Home", link: "/", icon: <HomeIcon /> },
    { title: "About", link: "/about", icon: <InfoIcon /> },
  ];

  const buisnessArr = [
    { title: "My Cards", link: "/my-cards", icon: <PortraitIcon /> },
    { title: "About", link: "/about", icon: <InfoIcon /> },
  ];

  const navigate = useNavigate();
  const { userData } = React.useContext(UserContext);

  return (
    <>
      <div>
        <Typography variant="h2" margin={1}>
          <AppTitle />
        </Typography>
        {openArr.map((tab) => (
          <Box key={tab.title}>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate(tab.link);
                  }}
                >
                  <ListItemIcon>{tab.icon}</ListItemIcon>
                  <ListItemText primary={tab.title} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </Box>
        ))}
        {verifyToken() && (
          <>
            <Divider />
            <List>
              <ListItem disablePadding>
                <ListItemButton
                  onClick={() => {
                    navigate("/favorite-card");
                  }}
                >
                  <ListItemIcon>
                    <FavoriteIcon />
                  </ListItemIcon>
                  <ListItemText primary={"My Favorites"} />
                </ListItemButton>
              </ListItem>
            </List>
            <Divider />
          </>
        )}
        {buisnessArr.map((tab) =>
          userData?.bizChecked || verifyUiAdmin(userData!) ? (
            <Box key={tab.title}>
              <Divider />
              <List>
                <ListItem disablePadding>
                  <ListItemButton
                    onClick={() => {
                      navigate(tab.link);
                    }}
                  >
                    <ListItemIcon>{tab.icon}</ListItemIcon>
                    <ListItemText primary={tab.title} />
                  </ListItemButton>
                </ListItem>
              </List>
              <Divider />
            </Box>
          ) : (
            <span></span>
          )
        )}
      </div>
    </>
  );
}

export default DrawerTabs;
