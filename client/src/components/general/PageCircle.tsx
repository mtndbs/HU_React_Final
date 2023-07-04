import { Box } from "@mui/material";
import Circle from "./Circle";

function PageCircle() {
  return (
    <Box display={"flex"} justifyContent={"center"} marginTop={"15%"}>
      <Circle _size={60} />
    </Box>
  );
}

export default PageCircle;
