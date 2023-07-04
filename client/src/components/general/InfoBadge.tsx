import { Box, Link } from "@mui/material";
import { ReactNode } from "react";

interface Props {
  //   children: ReactNode;
  bgColor?: string;
  icon?: ReactNode;
  data?: string;
  link?: string;
}

function InfoBadge({ data, icon, link, bgColor = "" }: Props) {
  return (
    <Box
      margin={1}
      display={"flex"}
      flexDirection={"row"}
      sx={{
        borderRadius: "10px",
        border: "solid black 3px",
        backgroundColor: bgColor,
        color: "#00000",
      }}
    >
      <Box
        display={"flex"}
        justifyContent={"center"}
        sx={{
          borderRadius: "50%",
          width: "30px",
          height: "30px",
          paddingTop: "3px",
        }}
      >
        {icon}
      </Box>
      <Box sx={{ paddingTop: "5px" }}>
        {data}
        <Link underline="none" href={`/${link}`}>
          {link}
        </Link>
      </Box>
    </Box>
  );
}

export default InfoBadge;
