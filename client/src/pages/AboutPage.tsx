import { Box, Typography } from "@mui/material";
import Title from "../components/general/Title";

function AboutPage() {
  return (
    <>
      <Box marginTop={4}>
        <Title mainText="About BuisCase" subText="Join us to our jurney"></Title>
        <Box sx={{ maxwidth: "60vw", textalign: "justify" }}>
          <Typography align="inherit" gutterBottom paragraph>
            Welcome to our application, where businesses thrive and advertising reaches new heights! We are proud to introduce a
            platform that revolutionizes the way businesses connect with their target audience. Our application is designed to
            bring together a vast array of businesses and provide them with a comprehensive advertising service, creating a
            dynamic and fruitful ecosystem for growth.
          </Typography>
          <Typography align="inherit" gutterBottom paragraph>
            At its core, our application aims to bridge the gap between businesses and potential customers, creating a seamless
            experience for both parties. We understand that in today's competitive market, visibility is paramount, and that's
            where our advertising service comes into play. With our cutting-edge technology and intuitive features, we empower
            businesses of all sizes to expand their reach and capture the attention of their desired clientele.
          </Typography>
          <Typography align="inherit" gutterBottom paragraph>
            Our platform boasts a diverse range of businesses, catering to various industries, ensuring that there is something
            for everyone. Whether you're a small local enterprise or a multinational corporation, our application provides a level
            playing field for businesses to showcase their products and services, generating leads and driving conversions like
            never before.
          </Typography>
        </Box>
      </Box>
    </>
  );
}

export default AboutPage;
