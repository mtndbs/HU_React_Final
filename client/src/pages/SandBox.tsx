import * as React from "react";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import { adminDeleteUser, adminSetUser, getAllUsers } from "../services/ApiService";
import { User } from "../services/Interfaces";
import { titleCase } from "../hooks/helpFunctions";
import { FormControlLabel, IconButton, Switch } from "@mui/material";
import { toast } from "react-toastify";
import DeleteIcon from "@mui/icons-material/Delete";
import GerenralModal from "../components/general/GeneralModal";
import Title from "../components/general/Title";
import PageCircle from "../components/general/PageCircle";

export default function SandBox() {
  const [usersRows, setUsersRows] = React.useState<Array<User>>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    getAllUsers().then((json) => {
      setUsersRows(json);
    });
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const handleBizChanged = (_id: any, bizChecked: boolean) => {
    adminSetUser({ _id, bizChecked })
      .then((json) => {
        const user = json.data;
        toast.success(`${titleCase(`${user.name} ${user.lastName}`)} ${user.bizChecked ? "set" : "unset"} as Buisness `);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const onDelete = async (_id: any) => {
    adminDeleteUser(_id).then(() => {
      // eslint-disable-next-line array-callback-return
      const updated = usersRows.filter((user) => {
        if (user._id === _id) {
          toast.success(`${user.name} deleted succesfully!`);
        }
        if (user._id !== _id) {
          return user;
        }
      });
      setUsersRows([...updated]);
    });
  };

  // Modal functions
  const [open, setOpen] = React.useState(false);
  const handleClickOpen = () => {
    console.log("hello true");
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <>
      <Title mainText="ADMIN console" />
      {loading ? (
        <PageCircle />
      ) : (
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell align="center">Email</TableCell>
                <TableCell align="center">Role</TableCell>
                <TableCell align="center">Status</TableCell>
                <TableCell align="left">Action</TableCell>
                <TableCell align="left">ID</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {usersRows.map((row, index) => (
                <>
                  <TableRow
                    key={row._id}
                    sx={{
                      "&:last-child td, &:last-child th": { border: 0 },
                      textDecoration: !row.active ? "line-through" : "",
                      color: !row.active ? "red" : "",
                    }}
                  >
                    <TableCell align="left">{titleCase(`${row.name} ${row.lastName}`)}</TableCell>
                    <TableCell align="center">{row.email}</TableCell>
                    <TableCell align="center">{row.role}</TableCell>
                    <TableCell align="center">
                      <FormControlLabel
                        control={<Switch />}
                        checked={usersRows[index].bizChecked!}
                        onChange={() => {
                          handleBizChanged(row._id, !row.bizChecked);
                          const updatedObject = { ...row, bizChecked: !row.bizChecked };
                          const i = usersRows.findIndex((item) => item._id === updatedObject._id);
                          const upDatedArray = [...usersRows];
                          upDatedArray[i] = updatedObject;
                          setUsersRows(upDatedArray);
                        }}
                        label={row.bizChecked ? "Buisness" : "No biz"}
                      />
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row.role !== "admin" && (
                        <IconButton
                          onClick={() => {
                            handleClickOpen();
                          }}
                        >
                          <DeleteIcon />
                        </IconButton>
                      )}
                    </TableCell>
                    <TableCell component="th" scope="row">
                      {row._id}
                    </TableCell>
                  </TableRow>
                  <GerenralModal
                    open={open}
                    handleCloseFunc={handleClose}
                    onDeleteFunc={() => {
                      onDelete(usersRows[index]._id);
                    }}
                    title={"DELETE , deleting User from the database"}
                  >
                    You're Should you want to Delete "{row.name}" card?
                  </GerenralModal>
                </>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </>
  );
}
