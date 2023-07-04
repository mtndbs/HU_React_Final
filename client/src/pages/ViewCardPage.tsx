import { Avatar, Box, Container, Typography } from "@mui/material";
import { palette } from "../plugins/mui";
import { useParams } from "react-router-dom";
import { getCardById } from "../services/ApiService";
import React from "react";
import MapboxMap from "../hooks/MapboxMap";
import { Bcard } from "../services/Interfaces";
import PageCircle from "../components/general/PageCircle";
import InfoBadge from "../components/general/InfoBadge";
import EmailIcon from "@mui/icons-material/Email";
import PhoneAndroidIcon from "@mui/icons-material/PhoneAndroid";
import LanguageIcon from "@mui/icons-material/Language";
function ViewCardPage() {
  const [loading, setLoading] = React.useState(true);
  const [Buisness, setBuisness] = React.useState<Bcard>({});
  const { id } = useParams();

  const mainTitle = Buisness && Buisness.title ? Buisness.title.split("-")[0] : "Busisness";
  const subTitle = Buisness && Buisness.title ? Buisness.title.split("-")[1] : "Person";
  React.useEffect(() => {
    if (!id) return;
    const getData = async () => {
      getCardById(id)
        .then((card) => {
          setBuisness(card);
        })
        .catch((err) => {
          console.log(err);
        });
    };
    getData();
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, [id]);

  return (
    <Container sx={{ display: "flex", flexDirection: "column", marginTop: "100px" }}>
      {loading ? (
        <PageCircle />
      ) : (
        <Container className="view-main-wrap">
          <>
            <Box
              className="left-box"
              sx={{
                backgroundColor: palette.secondary.main,
              }}
            >
              <Box className="avatar-wrap">
                <Avatar
                  alt=""
                  src={
                    Buisness.image
                      ? Buisness.image
                      : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
                  }
                  sx={{ width: 235, height: 220, margin: "-70px" }}
                />
              </Box>

              <Typography variant="h1" padding={2} gutterBottom sx={{ marginTop: "80px" }}>
                {subTitle}
              </Typography>
              <Typography variant="body2" padding={2} gutterBottom>
                {Buisness.subTitle}
              </Typography>
            </Box>

            <Box>
              <Typography variant="h1" gutterBottom>
                {mainTitle}
              </Typography>
              <Typography variant="body1" gutterBottom>
                {Buisness.description}
                <InfoBadge icon={<EmailIcon />} data={Buisness.email || "no email avialble"}></InfoBadge>
                <InfoBadge icon={<PhoneAndroidIcon />} data={Buisness.phone || "no phone avialble"}></InfoBadge>
                <InfoBadge icon={<LanguageIcon />} link={Buisness.web || "no website avialble"}></InfoBadge>
              </Typography>
            </Box>
            <Box>
              <MapboxMap longitude={Buisness.longitude} latitude={Buisness.latitude} />
            </Box>
          </>
        </Container>
      )}
    </Container>
  );
}

export default ViewCardPage;
