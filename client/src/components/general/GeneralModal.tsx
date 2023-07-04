import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, Button } from "@mui/material";
import { red } from "@mui/material/colors";
import { ReactNode } from "react";

interface Props {
  children: ReactNode;
  open: boolean;
  handleCloseFunc: Function;
  onDeleteFunc: Function;
  _id?: any;
  title?: string;
}
function GerenralModal({ children, open, handleCloseFunc, onDeleteFunc, title }: Props) {
  return (
    <>
      <div>
        <Dialog
          open={open}
          onClose={() => {
            handleCloseFunc();
          }}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
          sx={{ borderRadius: "10px" }}
        >
          <DialogTitle id="alert-dialog-title">{title}</DialogTitle>
          <DialogContent>
            <DialogContentText color={red[500]} id="alert-dialog-description">
              {children}
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button
              onClick={() => {
                handleCloseFunc();
              }}
            >
              Cancel
            </Button>
            <Button
              onClick={() => {
                onDeleteFunc();
                handleCloseFunc();
              }}
              autoFocus
            >
              Yes
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
}

export default GerenralModal;
