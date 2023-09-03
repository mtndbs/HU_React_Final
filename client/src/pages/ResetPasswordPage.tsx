// function ResetPasswordPage() {
//     return (  );
// }

// export default ResetPasswordPage;

import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import {
  Container,
  FormControl,
  FormHelperText,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Typography,
} from "@mui/material";
import Title from "../components/general/Title";
import { toast } from "react-toastify";
import { Link, useNavigate, useParams } from "react-router-dom";
import Circle from "../components/general/Circle";
import AuthButton from "../components/general/authButton";
import { login, resetPassword } from "../services/ApiService";
import { setToken, setUser } from "../auth/TokenManager";
import { UserContext } from "../hooks/UserContext";
import { VisibilityOff, Visibility, Margin } from "@mui/icons-material";
import PageCircle from "../components/general/PageCircle";
import AppTitle from "../components/AppTitle";
import { isValidPassword } from "../hooks/helpFunctions";

function ResetPasswordPage() {
  // generic
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");
  const { token } = useParams();

  const { setUserData } = React.useContext(UserContext);
  const [showPassword, setShowPassword] = React.useState(false);
  const handleClickShowPassword = () => setShowPassword((show) => !show);
  const handleMouseDownPassword = (event: React.MouseEvent<HTMLButtonElement>) => {
    event.preventDefault();
  };

  const [loadCircle, setLoadCircle] = React.useState(false);
  const navigate = useNavigate();

  // password useStates

  const [password, setPassword] = React.useState("");
  const [passwordLabel, setPasswordLabel] = React.useState("Password *");
  const [passwordErr, setPasswordErr] = React.useState("");
  const [fieldPasswordErr, setfieldPasswordErr] = React.useState(false);

  // confirm password useState
  const [confirmPassword, setconfirmPassword] = React.useState("");
  const [confirmPasswordLabel, setConfirmPasswordLabel] = React.useState("Confirm password *");
  const [confirmPasswordErr, setConfirmPasswordErr] = React.useState("");
  const [fieldconfirmPasswordErr, setfieldConfirmPasswordErr] = React.useState(false);
  // useEffect

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const setPasswordCorrect = (bool: boolean, msg: string = "") => {
    setPasswordErr(bool ? "" : msg);
    setfieldPasswordErr(bool ? false : true);
    setPasswordLabel(bool ? "Password*" : "Error");
  };
  const setConfirmPasswordCorrect = (bool: boolean) => {
    setConfirmPasswordLabel(bool ? "Confirm password*" : "");
    setConfirmPasswordErr(bool ? "" : "The password are not the same!");
    setfieldConfirmPasswordErr(bool ? false : true);
  };

  const validate = (): boolean => {
    if (password.length < 1) {
      setPasswordCorrect(true);
    }
    if (confirmPassword.length < 1) {
      setPasswordCorrect(true);
    }

    !isValidPassword(password) || password.length < 6
      ? setPasswordCorrect(false, "Password must be atleat 6 chars, password must contain !@%$#^&*-_* and one Capital letter")
      : setPasswordCorrect(true);
    // password !== confirmPassword ? setConfirmPasswordCorrect(false) : setConfirmPasswordCorrect(true);

    if (!password || password.length < 2) {
      setPasswordCorrect(false);
      return false;
    }
    if (password !== confirmPassword) {
      setConfirmPasswordCorrect(false);
      return false;
    }

    return true;
  };

  const handleClick = () => {
    setLoadCircle(true);

    if (!validate()) {
      toast.error("Please enter the details correctly ");
      setLoadCircle(false);
      return;
    }

    resetPassword(password, token ? token : "")
      .then((json) => {
        console.log(json);
        if (json && json.status === "fail") {
          toast.error(json.message);
        } else {
          setMsg("New password updated!...Loggin...");
          setToken(json.token);
          setUser(json);

          setUserData(json);
          setTimeout(() => {
            navigate("/");
          }, 2000);
        }
      })
      .finally(() => {
        setLoadCircle(false);
      });
  };
  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      {loading ? (
        <PageCircle />
      ) : (
        <Box
          component="form"
          // onKeyUp={() => validate()}
          autoComplete="off"
          m={1}
          sx={{
            height: "50vh",
            width: "40vw",
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
            "@media (max-width: 600px)": {
              width: "90vw",
            },
          }}
        >
          <Box textAlign={"center"}>
            <AppTitle size={"60px"} />
          </Box>
          <Title mainText={"Reset Password"} subText="Please Provide new password" />

          <FormControl sx={{ width: "100%", margin: "2px", marginBottom: 2 }} variant="outlined">
            <InputLabel htmlFor="outlined-adornment-password">{passwordLabel}</InputLabel>
            <OutlinedInput
              onChange={(e) => setPassword(e.target.value)}
              value={password}
              error={fieldPasswordErr}
              // id="outlined-adornment-password"
              type={showPassword ? "text" : "password"}
              label={passwordLabel}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={handleClickShowPassword}
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
            />
            <FormHelperText sx={{ color: "#d32f2f" }}>{passwordErr}</FormHelperText>
          </FormControl>
          <TextField
            sx={{ width: "100%", marginBottom: "10px" }}
            className="sign-field"
            label={confirmPasswordLabel}
            variant="outlined"
            type="password"
            value={confirmPassword}
            onChange={(e) => setconfirmPassword(e.target.value)}
            error={fieldconfirmPasswordErr}
            helperText={confirmPasswordErr}
          />

          <AuthButton margin={0} handleClick={() => handleClick}>
            Submit {loadCircle && <Circle _size={30} />}
          </AuthButton>
          <Typography variant="h6" color="green" minHeight={"20px"} textAlign={"center"}>
            {msg}
          </Typography>
          <Typography align="center" sx={{ margin: 1 }}>
            Back to <Link to={"/"}>Home</Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default ResetPasswordPage;
