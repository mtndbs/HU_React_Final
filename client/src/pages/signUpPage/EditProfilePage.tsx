import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Container } from "@mui/material";
import Title from "../../components/general/Title";
import { toast } from "react-toastify";
import * as EmailValidator from "email-validator";
import AuthButton from "../../components/general/authButton";
import { useNavigate } from "react-router-dom";
import Circle from "../../components/general/Circle";
import { sxStyles } from "../../hooks/sxStyles";
// import "../signUpPage/signUp.css";
import "../../App.css";

import { isValidIsraeliPhoneNumber, titleCase } from "../../hooks/helpFunctions";
import { editUser, getUserInfo } from "../../services/ApiService";
import PageCircle from "../../components/general/PageCircle";
import { User } from "../../services/Interfaces";
function EditProfilePage() {
  // generic
  const [userInfo, setUserInfo] = React.useState<User>({});

  const [loading, setLoading] = React.useState(true);
  const [loadCircle, setLoadCircle] = React.useState(false);
  const addSxStyle = sxStyles();
  const navigate = useNavigate();

  //name useStates
  const [name, setName] = React.useState(userInfo.name || "");
  const [nameLabel, setNameLabel] = React.useState("Name *");
  const [nameErr, setNameErr] = React.useState("");
  const [fieldNameErr, setfieldNameErr] = React.useState(false);
  // last name useStates
  const [lastName, setLastName] = React.useState("");
  const [lastNameLabel, setLastNameLabel] = React.useState("Last name *");
  const [lastNameErr, setLastNameErr] = React.useState("");
  const [fieldLastNameErr, setfieldLastNameErr] = React.useState(false);

  // email useStates
  const [email, setEmail] = React.useState("");
  const [emailLabel, seteMailLabel] = React.useState("Email *");
  const [emailErr, setEmailErr] = React.useState("");
  const [fieldEmailErr, setfieldEmailErr] = React.useState(false);
  //Phone
  const [phone, setPhone] = React.useState("");
  const [phoneLabel, setPhoneLabel] = React.useState("Phone *");
  const [phoneErr, setPhoneErr] = React.useState("");
  const [fieldPhoneErr, setfieldPhoneErr] = React.useState(false);

  // image useState
  const [image, setImage] = React.useState("");

  const [country, setCountry] = React.useState("");
  const [countryLabel, setCountryLabel] = React.useState("Country *");
  const [countryErr, setCountryErr] = React.useState("");
  const [fieldCountryErr, setfieldCountryErr] = React.useState(false);
  //city useState
  const [city, setCity] = React.useState("");
  const [cityLabel, setCityLabel] = React.useState("City *");
  const [cityErr, setCityErr] = React.useState("");
  const [fieldCityErr, setfieldCityErr] = React.useState(false);
  // street useState
  const [street, setStreet] = React.useState("");
  const [streetLabel, setStreetLabel] = React.useState("Street *");
  const [streetErr, setStreetErr] = React.useState("");
  const [fieldStreetErr, setfieldStreetErr] = React.useState(false);
  // hose number useState
  const [houseNumber, setHouseNumber] = React.useState("");
  // zip useState
  const [zip, setZip] = React.useState("");

  React.useEffect(() => {
    getUserInfo().then((json) => {
      setUserInfo(json);
      setName(json.name || "");
      setLastName(json.lastName || "");
      setEmail(json.email || "");
      setPhone(json.phone || "");
      setCountry(json.country || "");
      setCity(json.city || "");
      setStreet(json.street || "");
      setImage(json.image || "");
      setZip(json.zip || "");
      setHouseNumber(json.houseNumber || "");

      console.log(json);
    });

    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // ===============
  const setNameCorrect = (bool: boolean) => {
    setNameErr(bool ? "" : "Name must be atleast 2 chars");
    setNameLabel(bool ? "Name*" : "Error");
    setfieldNameErr(bool ? false : true);
  };
  const setCountryCorrect = (bool: boolean) => {
    setCountryErr(bool ? "" : "Country is required");
    setCountryLabel(bool ? "Country*" : "Error");
    setfieldCountryErr(bool ? false : true);
  };
  const setCityCorrect = (bool: boolean) => {
    setCityErr(bool ? "" : "City is required");
    setCityLabel(bool ? "City*" : "Error");
    setfieldCityErr(bool ? false : true);
  };

  const setStreetCorrect = (bool: boolean) => {
    setStreetErr(bool ? "" : "Street is required");
    setStreetLabel(bool ? "Street*" : "Error");
    setfieldStreetErr(bool ? false : true);
  };

  const setLastNameCorrect = (bool: boolean) => {
    setLastNameErr(bool ? "" : "Last name must be atleast 2 chars");
    setfieldLastNameErr(bool ? false : true);
    setLastNameLabel(bool ? "Last name*" : "Error");
  };

  const setEmailCorrect = (bool: boolean) => {
    setEmailErr(bool ? "" : "Email is not Valid");
    setfieldEmailErr(bool ? false : true);
    seteMailLabel(bool ? "Email*" : "Error");
  };

  const setPhoneCorrect = (bool: boolean) => {
    setPhoneErr(bool ? "" : "Phone number must be 9 digits");
    setfieldPhoneErr(bool ? false : true);
    setPhoneLabel(bool ? "Phone*" : "Error");
  };

  const validateButtonCheck = () => {
    EmailValidator.validate(email) ? setEmailCorrect(true) : setEmailCorrect(false);
    name.length < 2 ? setNameCorrect(false) : setNameCorrect(true);
    lastName.length < 2 ? setLastNameCorrect(false) : setLastNameCorrect(true);
    isValidIsraeliPhoneNumber(phone) ? setPhoneCorrect(true) : setPhoneCorrect(false);
    country.length < 1 ? setCountryCorrect(false) : setCountryCorrect(true);
    city.length < 1 ? setCityCorrect(false) : setCityCorrect(true);
    street.length < 1 ? setStreetCorrect(false) : setStreetCorrect(true);
  };

  const validate = (): boolean => {
    // UI typing validation

    !isValidIsraeliPhoneNumber(phone) ? setPhoneCorrect(false) : setPhoneCorrect(true);

    !EmailValidator.validate(email) ? setEmailCorrect(false) : setEmailCorrect(true);

    // Reset empty required inputs from errors
    if (phone.length <= 1) {
      setPhoneCorrect(true);
    }
    if (email.length <= 1) {
      setEmailCorrect(true);
    }
    if (country.length <= 1) {
      setCountryCorrect(true);
    }
    if (name.length <= 1) {
      setNameCorrect(true);
    }
    if (lastName.length <= 1) {
      setLastNameCorrect(true);
    }
    if (city.length <= 1) {
      setCityCorrect(true);
    }
    if (street.length <= 1) {
      setStreetCorrect(true);
    }
    // Final validation
    if (
      country.length < 1 ||
      city.length < 1 ||
      street.length < 1 ||
      !EmailValidator.validate(email) ||
      !isValidIsraeliPhoneNumber(phone)
    ) {
      return false;
    }
    return true;
  };

  const handleClick = () => {
    if (!validate()) {
      toast.error("Please enter the details correctly ");
      validateButtonCheck();
      return;
    }
    console.log({
      name,
      lastName,
      phone,
      email,
      street,
      image,
      country,
      city,
      houseNumber,
      zip,
    });

    editUser({
      name,
      lastName,
      phone,
      email,
      street,
      image,
      country,
      city,
      houseNumber,
      zip,
    })
      .then((user) => {
        console.log(user);
        setLoadCircle(true);
        setTimeout(() => {
          navigate("/profile");
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
        // border: "solid 1px black",
      }}
    >
      {loading ? (
        <PageCircle />
      ) : (
        <Box onKeyUp={() => validate()} component="form" sx={{ ...addSxStyle }}>
          <Title mainText={`Edit ${titleCase(`${name} ${lastName}`)} Profile Details `} subText="Please edit" />
          <Box display={"flex"} className="myBox">
            <TextField
              className="sign-field"
              autoFocus={true}
              label={nameLabel}
              variant="outlined"
              value={name}
              onChange={(e) => setName(e.target.value)}
              error={fieldNameErr}
              helperText={nameErr}
            />

            <TextField
              className="sign-field"
              label={lastNameLabel}
              variant="outlined"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              error={fieldLastNameErr}
              helperText={lastNameErr}
            />
          </Box>

          <Box display={"flex"} className="myBox">
            <TextField
              className="sign-field"
              label={phoneLabel}
              variant="outlined"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              error={fieldPhoneErr}
              helperText={phoneErr}
            />

            <TextField
              className="sign-field"
              label={emailLabel}
              variant="outlined"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              error={fieldEmailErr}
              helperText={emailErr}
            />
          </Box>

          <Box display={"flex"} className="myBox">
            <TextField
              className="sign-field"
              label={"Image"}
              variant="outlined"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
            <TextField
              className="sign-field"
              label={countryLabel}
              variant="outlined"
              value={country}
              error={fieldCountryErr}
              helperText={countryErr}
              onChange={(e) => setCountry(e.target.value)}
            />
          </Box>
          <Box display={"flex"} className="myBox">
            <TextField
              className="sign-field"
              label={cityLabel}
              variant="outlined"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              error={fieldCityErr}
              helperText={cityErr}
            />

            <TextField
              className="sign-field"
              label={streetLabel}
              variant="outlined"
              value={street}
              onChange={(e) => setStreet(e.target.value)}
              error={fieldStreetErr}
              helperText={streetErr}
            />
          </Box>
          <Box display={"flex"} className="myBox">
            <TextField
              className="sign-field"
              label={"House number"}
              variant="outlined"
              value={houseNumber}
              onChange={(e) => setHouseNumber(e.target.value)}
            />
            <TextField
              className="sign-field"
              label={"Zip"}
              variant="outlined"
              value={zip}
              onChange={(e) => setZip(e.target.value)}
            />
          </Box>

          <AuthButton handleClick={() => handleClick}>Submit {loadCircle && <Circle _size={30} />} </AuthButton>
        </Box>
      )}
    </Container>
  );
}

export default EditProfilePage;
