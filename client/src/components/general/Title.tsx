import { Box, Typography } from "@mui/material";

interface Props {
  mainText: string;
  subText?: string;
}

function Title({ mainText, subText }: Props) {
  return (
    <Box sx={{ width: "100%", textAlign: "center", marginBottom: "10px" }}>
      <Typography variant="h2" gutterBottom>
        {mainText}
      </Typography>
      {subText && <Typography variant="h4">{subText}</Typography>}
    </Box>
  );
}

export default Title;
