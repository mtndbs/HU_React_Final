import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container, Typography } from "@mui/material";
import Title from "../components/general/Title";
import { toast } from "react-toastify";
import * as EmailValidator from "email-validator";
import { Link, useNavigate } from "react-router-dom";
import Circle from "../components/general/Circle";
import AuthButton from "../components/general/authButton";
import { forgotPassword, login } from "../services/ApiService";
import PageCircle from "../components/general/PageCircle";
import AppTitle from "../components/AppTitle";

function ForgotPasswordPage() {
  // generic
  const [loading, setLoading] = React.useState(true);
  const [msg, setMsg] = React.useState("");

  const [loadCircle, setLoadCircle] = React.useState(false);
  const navigate = useNavigate();

  // email useStates

  const [email, setEmail] = React.useState("");
  const [emailLabel, seteMailLabel] = React.useState("Email");
  const [emailErr, setEmailErr] = React.useState("");
  const [fieldEmailErr, setfieldEmailErr] = React.useState(false);

  // useEffect

  React.useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1200);
    return () => clearTimeout(timer);
  }, []);

  const setEmailCorrect = (bool: boolean) => {
    if (bool) {
      setEmailErr("");
      setfieldEmailErr(false);
      seteMailLabel("Email");
    } else {
      seteMailLabel("Error");
      setEmailErr("Email is not Valid");
      setfieldEmailErr(true);
    }
  };

  const validateButtonCheck = () => {
    EmailValidator.validate(email) ? setEmailCorrect(true) : setEmailCorrect(false);
  };

  const validate = (): boolean => {
    if (email.length < 1) {
      setEmailCorrect(true);
      return false;
    }

    if (!EmailValidator.validate(email)) {
      setEmailCorrect(false);
      return false;
    }
    setEmailCorrect(true);

    return true;
  };

  const handleClick = () => {
    setLoadCircle(true);
    if (!validate()) {
      toast.error("Please enter the details correctly ");
      validateButtonCheck();
      setLoadCircle(false);
      return;
    }

    forgotPassword(email)
      .then((json) => {
        console.log(json);
        if (json && json.status === "fail") {
          toast.error(json.message);
          setEmailCorrect(false);
          setMsg("");
        } else {
          setMsg("Email as been sent , Please check your Email (Valid for 10 minuts only)");
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
          onKeyUp={() => validate()}
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
            <AppTitle />
          </Box>
          <Title mainText={"Forgot password"} subText="Please provide your email for password reset" />

          <TextField
            sx={{ m: 1 }}
            autoFocus={true}
            id="outlined-basic"
            label={emailLabel}
            variant="outlined"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            error={fieldEmailErr}
            helperText={emailErr}
          />

          <AuthButton margin={1} handleClick={() => handleClick}>
            Submit {loadCircle && <Circle _size={30} />}
          </AuthButton>
          <Typography variant="h6" color="green" height={"20px"} textAlign={"center"}>
            {msg}
          </Typography>
          <Typography align="center" marginTop={3}>
            <Link to={"/login"}>Back to login</Link>
          </Typography>
        </Box>
      )}
    </Container>
  );
}

export default ForgotPasswordPage;
