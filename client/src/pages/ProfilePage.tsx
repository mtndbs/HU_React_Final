import { Container, Box, Avatar, Typography, TextField } from "@mui/material";
import { palette } from "../plugins/mui";
import { useEffect } from "react";
import { getUserInfo } from "../services/ApiService";
import { User } from "../services/Interfaces";
import React from "react";
import PageCircle from "../components/general/PageCircle";
import { titleCase } from "../hooks/helpFunctions";
import RegularButton from "../components/general/RegularButton";
import { useNavigate } from "react-router-dom";

function ProfilePage() {
  const [userInfo, setUserInfo] = React.useState<User>({});
  const [userArrKey, setUserArrKey] = React.useState<Array<string>>([]);
  const [userArrValue, setUserArr] = React.useState<Array<User>>([]);
  const [loading, setLoading] = React.useState(true);
  const navigate = useNavigate();

  // Edit states

  const handleEdit = () => {
    navigate("/edit-user");
  };

  useEffect(() => {
    getUserInfo().then((json) => {
      const arrValue = Object.values(json);
      const arrKey = Object.keys(json);
      setUserInfo(json);
      setUserArr(arrValue);
      setUserArrKey(arrKey);
    });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", marginTop: "50px" }}>
      {loading ? (
        <PageCircle />
      ) : (
        <>
          <Container>
            <Box
              sx={{
                margin: "10px auto",
              }}
            >
              <Box className="avatar-wrap">
                <Avatar
                  alt={userInfo.imageAlt ? userInfo.imageAlt : "User picture"}
                  src={
                    userInfo.image
                      ? userInfo.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  sx={{ width: 130, height: 130 }}
                />
              </Box>

              <Typography variant="h1" padding={2} gutterBottom sx={{ marginTop: "50", textAlign: "center" }}>
                {titleCase(`${userInfo.name} ${userInfo.lastName}`)}
              </Typography>

              <Box
                className="user-info-wrap"
                component="form"
                sx={{
                  "& .MuiTextField-root": { m: 1, width: "30ch" },
                }}
                noValidate
                autoComplete="off"
              >
                {userArrValue.map((item, index) => (
                  <TextField
                    focused={true}
                    key={index}
                    id="outlined-read-only-input"
                    label={userArrKey[index]}
                    defaultValue={item}
                    InputProps={{
                      readOnly: true,
                    }}
                  />
                ))}
              </Box>
            </Box>
          </Container>
          <Box display={"flex"} justifyContent={"center"}>
            <Box display={"flex"} flexDirection={"column"}>
              <RegularButton color={palette.secondary.main} handleClick={handleEdit} width="200px">
                Edit
              </RegularButton>
            </Box>
          </Box>
        </>
      )}
    </Container>
  );
}

export default ProfilePage;
