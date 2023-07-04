import * as React from "react";
import Stack from "@mui/material/Stack";
import CircularProgress from "@mui/material/CircularProgress";
interface Props {
  _size: number;
}
function Circle({ _size }: Props) {
  return (
    <Stack sx={{ color: "grey.500", marginLeft: "10px" }} spacing={2} direction="row">
      {/* <CircularProgress color="secondary" /> */}
      <CircularProgress color="secondary" size={_size} />
      {/* <CircularProgress color="inherit" /> */}
    </Stack>
  );
}
export default Circle;
