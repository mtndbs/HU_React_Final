import { Button } from "@mui/material";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  handleClick: Function;
  margin?: number;
}
function AuthButton({ children, handleClick, margin = 2 }: Props) {
  return (
    <>
      <Button
        sx={{
          height: "45px",
          width: "100%",
          margin: margin,
          marginTop: "5px",
          borderRadius: "14px",
          color: "white",
          backgroundColor: "primary",
        }}
        variant="contained"
        onClick={handleClick()}
      >
        {children}
      </Button>
    </>
  );
}

export default AuthButton;
