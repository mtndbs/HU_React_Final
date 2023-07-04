import * as React from "react";
import BottomNavigation from "@mui/material/BottomNavigation";
import BottomNavigationAction from "@mui/material/BottomNavigationAction";
import PortraitIcon from "@mui/icons-material/Portrait";
import FavoriteIcon from "@mui/icons-material/Favorite";
import { Fab, Paper } from "@mui/material";
import { useNavigate } from "react-router-dom";
import AddIcon from "@mui/icons-material/Add";
import { UserContext } from "../hooks/UserContext";
import InfoIcon from "@mui/icons-material/Info";
import { verifyUiAdmin } from "../auth/TokenManager";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { palette } from "../plugins/mui";

console.error = () => {};

export default function LabelBottomNavigation() {
  const [value, setValue] = React.useState("recents");
  const navigate = useNavigate();
  const { userData } = React.useContext(UserContext);

  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };

  return (
    <>
      {userData?.bizChecked || verifyUiAdmin(userData!) ? (
        <Fab
          color="primary"
          sx={{ position: "fixed", bottom: "10vh", left: "80%", width: "70px", height: "70px" }}
          size="large"
          aria-label="add"
          onClick={() => {
            navigate("/create-card");
          }}
        >
          <AddIcon />
        </Fab>
      ) : (
        <span></span>
      )}
      <Paper
        sx={{
          color: "inherit",
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          display: "flex",
          justifyContent: "center",
        }}
        elevation={3}
      >
        <BottomNavigation
          showLabels
          sx={{ width: 500, borderTopLeftRadius: "50px", borderTopRightRadius: "50px" }}
          value={value}
          onChange={handleChange}
        >
          <BottomNavigationAction
            sx={{ color: palette.secondary.main }}
            label="Back"
            value="Back"
            onClick={() => {
              navigate(-1);
            }}
            icon={<ArrowBackIcon sx={{ color: "inherit" }} />}
          />

          <BottomNavigationAction
            label="About"
            value="About"
            onClick={() => {
              navigate("/about");
            }}
            icon={<InfoIcon />}
          />

          {userData?.bizChecked || verifyUiAdmin(userData!) ? (
            <BottomNavigationAction
              label="Favorites"
              value="favorites"
              onClick={() => {
                navigate("/favorite-card");
              }}
              icon={<FavoriteIcon />}
            />
          ) : (
            <span></span>
          )}
          {userData?.bizChecked || verifyUiAdmin(userData!) ? (
            <BottomNavigationAction
              label="My cards!"
              onClick={() => {
                navigate("/my-cards");
              }}
              value="Add new Card"
              icon={<PortraitIcon />}
            />
          ) : (
            <span></span>
          )}
        </BottomNavigation>
      </Paper>
    </>
  );
}
