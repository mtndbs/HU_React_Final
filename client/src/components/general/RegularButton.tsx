import { Button } from "@mui/material";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  handleClick: Function;
  width: string;
  color?: string;
}

function RegularButton({ children, handleClick, width, color = "" }: Props) {
  return (
    <>
      <Button
        sx={{ height: "45px", borderRadius: "14px", margin: "5px", width: width, backgroundColor: color }}
        variant="contained"
        onClick={() => {
          handleClick();
        }}
      >
        {children}
      </Button>
    </>
  );
}

export default RegularButton;
