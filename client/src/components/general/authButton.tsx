import { Button } from "@mui/material";
import { ReactNode } from "react";
interface Props {
  children: ReactNode;
  handleClick: Function;
}
function AuthButton({ children, handleClick }: Props) {
  return (
    <>
      <Button
        sx={{ height: "45px", borderRadius: "14px", color: "white", backgroundColor: "primary" }}
        variant="contained"
        onClick={handleClick()}
      >
        {children}
      </Button>
    </>
  );
}

export default AuthButton;
