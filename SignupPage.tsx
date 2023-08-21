import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import LoadingButton from "@mui/lab/LoadingButton";
import { Autocomplete, Container, Stack, Typography } from "@mui/material";
import Title from "../components/general/Title";
import { toast } from "react-toastify";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

import {
  isValidIsraeliPhoneNumber,
  isValidPassword,
} from "../hooks/helpFunctions";
import { yeshivot } from "../data/yeshivot";
import { signup } from "../services/ApiService";
import { Link } from "react-router-dom";

function SignupPage() {
  // generic
  const [loading, setLoading] = React.useState(false);

  //firstName useStates
  const [firstName, setFirstName] = React.useState("");
  const [firstMnameLabel, setFirstNameLabel] = React.useState("שם");
  const [firstNameErr, setFirstNameErr] = React.useState("");
  const [fieldFirstNameErr, setfieldFirstNameErr] = React.useState(false);
  // lastName useStates
  const [lastName, setLastName] = React.useState("");
  const [lastNameLabel, setLastNameLabel] = React.useState("שם משפחה");
  const [lastNameErr, setLastNameErr] = React.useState("");
  const [fieldLastNameErr, setfieldLastNameErr] = React.useState(false);
  //Phone

  const [phone, setPhone] = React.useState("");
  const [phoneLabel, setPhoneLabel] = React.useState("טלפון");
  const [phoneErr, setPhoneErr] = React.useState("");
  const [fieldPhoneErr, setfieldPhoneErr] = React.useState(false);
  // password useStates
  const [password, setPassword] = React.useState("");
  const [passwordLabel, setPasswordLabel] = React.useState("סיסמה");
  const [passwordErr, setPasswordErr] = React.useState("");
  const [fieldPasswordErr, setfieldPasswordErr] = React.useState(false);

  const [yeshiva, setYeshiva] = React.useState("");
  const [yeshivaLabel, setYeshivaLabel] = React.useState("ישיבה");
  const [yeshivaErr, setYeshivaErr] = React.useState("");
  const [fieldYeshivaErr, setfieldYeshivaErr] = React.useState(false);
  //city useState

  // ===============
  const setNameCorrect = (bool: boolean) => {
    setFirstNameErr(bool ? "" : "שם חייב להכיל לפחות 2 אותיות");
    setFirstNameLabel(bool ? "שם" : "שגיאה");
    setfieldFirstNameErr(bool ? false : true);
  };
  const setYeshivaCorrect = (bool: boolean) => {
    setYeshivaErr(bool ? "" : "Yeshiva is required");
    setYeshivaLabel(bool ? "ישיבה" : "שגיאה");
    setfieldYeshivaErr(bool ? false : true);
  };

  const setLastNameCorrect = (bool: boolean) => {
    setLastNameErr(bool ? "" : "שם משפחה חייב להכיל לפחות 2 אותיות");
    setfieldLastNameErr(bool ? false : true);
    setLastNameLabel(bool ? "שם משפחה" : "שגיאה");
  };

  const setPhoneCorrect = (bool: boolean) => {
    setPhoneErr(bool ? "" : "מספר שגוי");
    setfieldPhoneErr(bool ? false : true);
    setPhoneLabel(bool ? "טלפון" : "שגיאה");
  };
  const setPasswordCorrect = (bool: boolean, msg: string = "") => {
    setPasswordErr(bool ? "" : msg);
    setfieldPasswordErr(bool ? false : true);
    setPasswordLabel(bool ? "סיסמה" : "שגיאה");
  };

  const validateButtonCheck = () => {
    firstName.length < 2 ? setNameCorrect(false) : setNameCorrect(true);
    lastName.length < 2 ? setLastNameCorrect(false) : setLastNameCorrect(true);
    isValidIsraeliPhoneNumber(phone)
      ? setPhoneCorrect(true)
      : setPhoneCorrect(false);
    password.length < 6
      ? setPasswordCorrect(false, "הסיסמה חייבת להכיל לפחות 6 תווים")
      : setPasswordCorrect(true);
  };

  const validate = (): boolean => {
    // UI typing validation

    !isValidIsraeliPhoneNumber(phone)
      ? setPhoneCorrect(false)
      : setPhoneCorrect(true);

    // Final validation
    if (
      yeshiva.length < 1 ||
      firstName.length < 1 ||
      lastName.length < 1 ||
      !isValidIsraeliPhoneNumber(phone) ||
      password.length < 4
    ) {
      return false;
    }
    return true;
  };

  const submit = () => {
    if (!validate()) {
      toast.error("אנא הכנס את הפרטים בצורה נכונה");
      validateButtonCheck();
      return;
    }
    setLoading(true);
    signup({
      firstName,
      lastName,
      phone,
      yeshiva,
      password,
    })
      .then((user) => {
        console.log(user);
        return signInWithEmailAndPassword(getAuth(), user.email, password);
      })
      .catch((err) => {
        console.error(err);
        toast.error(
          err.message === "auth/email-already-exists"
            ? "מספר הטלפון כבר קיים במערכת"
            : "שגיאה"
        );
      })
      .finally(() => setLoading(false));
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Stack
        spacing={2}
        component="form"
        sx={{
          mt: 10,
          width: { xs: 1, sm: 400 },
        }}
        onSubmit={(ev) => {
          ev.preventDefault();
          submit();
        }}
      >
        <Title mainText={"דף הרשמה"} subText="מלא את הפרטים והתחבר" />
        <TextField
          name="firstName"
          autoFocus={true}
          label={firstMnameLabel}
          variant="outlined"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          error={fieldFirstNameErr}
          helperText={firstNameErr}
        />

        <TextField
          name="lastName"
          label={lastNameLabel}
          variant="outlined"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          error={fieldLastNameErr}
          helperText={lastNameErr}
        />
        <Autocomplete
          disablePortal
          options={yeshivot}
          freeSolo
          inputValue={yeshiva}
          onInputChange={(event, newInputValue) => {
            setYeshiva(newInputValue);
          }}
          renderInput={(params) => (
            <TextField
              name="yeshiva"
              {...params}
              label={yeshivaLabel}
              variant="outlined"
              value={yeshiva}
              error={fieldYeshivaErr}
              helperText={yeshivaErr}
            />
          )}
        />
        <TextField
          type={"tel"}
          name="phone"
          label={phoneLabel}
          variant="outlined"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          error={fieldPhoneErr}
          helperText={phoneErr}
        />
        <TextField
          name="password"
          type={"password"}
          label={passwordLabel}
          variant="outlined"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={fieldPasswordErr}
          helperText={passwordErr}
        />
        <Box sx={{ display: "flex", justifyContent: "center", mx: "auto" }}>
          <LoadingButton
            loading={loading}
            variant="contained"
            fullWidth
            type="submit"
            sx={{ height: 45 }}
          >
            הרשם
          </LoadingButton>
        </Box>
        <Typography display={"flex"} justifyContent={"flex-end"}>
          יש לך כבר משתמש? <Link to={"/login"}>התחבר</Link>
        </Typography>
      </Stack>
    </Container>
  );
}

export default SignupPage;
