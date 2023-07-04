import * as React from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { Autocomplete, Button, Container } from "@mui/material";
import Title from "../components/general/Title";
import { toast } from "react-toastify";
import * as EmailValidator from "email-validator";
import AuthButton from "../components/general/authButton";
import { useNavigate } from "react-router-dom";
import Circle from "../components/general/Circle";
import { sxStyles } from "../hooks/sxStyles";
import AutorenewIcon from "@mui/icons-material/Autorenew";
// import "../signUpPage/signUp.css";
import { isValidIsraeliPhoneNumber } from "../hooks/helpFunctions";
import { countryList } from "../pages/signUpPage/allCountries";
import { addCard, getUserInfo } from "../services/ApiService";

function CreatCardPage() {
  React.useEffect(() => {
    getUserInfo().then((json) => {
      setEmail(json && json.email ? json.email : "");
      setDescription("");
      setweb("");
      setPhone(json && json.phone ? json.phone : "");
      setCity(json && json.city ? json.city : "");
      setStreet(json && json.street ? json.street : "");
      setImage("");
      setZip(json && json.zip ? json.zip : "");
      setHouseNumber(json && json.houseNumber ? json.houseNumber : "");
    });
  }, []);

  // generic
  const [loadCircle, setLoadCircle] = React.useState(false);
  const addSxStyle = sxStyles();
  const navigate = useNavigate();

  //Title useStates
  const [title, setTitle] = React.useState("");
  const [titleLabel, setTitleLabel] = React.useState("Title *");
  const [titleErr, setTitleErr] = React.useState("");
  const [fieldTitleErr, setfieldTitleErr] = React.useState(false);
  // Sub title useStates
  const [subTitle, setSubTitle] = React.useState("");
  const [subTitleLabel, setSubTitleLabel] = React.useState("Sub Title *");
  const [subTitleErr, setSubTitleErr] = React.useState("");
  const [fieldSubTitleErr, setfieldSubTitleErr] = React.useState(false);

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

  // description useStates
  const [description, setDescription] = React.useState("");
  const [descriptionLabel, setDescriptionLabel] = React.useState("Description *");
  const [descriptionErr, setDescriptionErr] = React.useState("Description must be atleat 10 chars");
  const [fieldDescriptionErr, setfieldDescriptionErr] = React.useState(false);
  // confirm password useState
  const [web, setweb] = React.useState("");
  const [webLabel, setwebLabel] = React.useState("Web");
  const [webErr, setwebErr] = React.useState("");
  const [fieldwebErr, setfieldwebErr] = React.useState(false);
  // image useState
  let [image, setImage] = React.useState("");
  // country useState
  const [country, setCountry] = React.useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [countrySelect, setCountrySelect] = React.useState<string | null>();
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

  // ===============
  const setTitleCorrect = (bool: boolean) => {
    setTitleErr(bool ? "" : "Title must be atleast 2 chars");
    setTitleLabel(bool ? "Title*" : "Error");
    setfieldTitleErr(bool ? false : true);
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

  const setSubTitleCorrect = (bool: boolean) => {
    setSubTitleErr(bool ? "" : "Sub Title must be atleast 2 chars");
    setfieldSubTitleErr(bool ? false : true);
    setSubTitleLabel(bool ? "Sub Title*" : "Error");
  };

  const setEmailCorrect = (bool: boolean) => {
    setEmailErr(bool ? "" : "Email is not Valid");
    setfieldEmailErr(bool ? false : true);
    seteMailLabel(bool ? "Email*" : "Error");
  };

  const setPhoneCorrect = (bool: boolean) => {
    setPhoneErr(bool ? "" : "Phone number is not Valid");
    setfieldPhoneErr(bool ? false : true);
    setPhoneLabel(bool ? "Phone*" : "Error");
  };

  const setDescriptionCorrect = (bool: boolean) => {
    setDescriptionErr(bool ? "" : "Description must be atleat 10 chars");
    setfieldDescriptionErr(bool ? false : true);
    setDescriptionLabel(bool ? "Description*" : "Error");
  };

  const setwebCorrect = (bool: boolean) => {
    setwebLabel(bool ? "Confirm password*" : "");
    setwebErr(bool ? "" : "The password are not the same!");
    setfieldwebErr(bool ? false : true);
  };

  const validateButtonCheck = () => {
    EmailValidator.validate(email) ? setEmailCorrect(true) : setEmailCorrect(false);
    description.length < 10 ? setDescriptionCorrect(false) : setDescriptionCorrect(true);
    title.length < 2 ? setTitleCorrect(false) : setTitleCorrect(true);
    subTitle.length < 2 ? setSubTitleCorrect(false) : setSubTitleCorrect(true);
    isValidIsraeliPhoneNumber(phone) ? setPhoneCorrect(true) : setPhoneCorrect(false);
    country.length < 1 ? setCountryCorrect(false) : setCountryCorrect(true);
    city.length < 1 ? setCityCorrect(false) : setCityCorrect(true);
    street.length < 1 ? setStreetCorrect(false) : setStreetCorrect(true);
  };

  const clearAllFieldsFunc = () => {
    setTitle("");
    setSubTitle("");
    setEmail("");
    setDescription("");
    setweb("");
    setPhone("");
    setCity("");
    setStreet("");
    setImage("");
    setZip("");
    setHouseNumber("");
    setTitleCorrect(true);
    setSubTitleCorrect(true);
    setEmailCorrect(true);
    setPhoneCorrect(true);
    setDescriptionCorrect(true);
    setwebCorrect(true);
    setCountryCorrect(true);
    setCityCorrect(true);
    setStreetCorrect(true);
  };
  const validate = (): boolean => {
    !isValidIsraeliPhoneNumber(phone) ? setPhoneCorrect(false) : setPhoneCorrect(true);

    !EmailValidator.validate(email) ? setEmailCorrect(false) : setEmailCorrect(true);

    // Reset empty required inputs from errors
    if (phone.length <= 1) {
      setPhoneCorrect(true);
    }
    if (email.length <= 1) {
      setEmailCorrect(true);
    }

    if (description.length <= 1) {
      setDescriptionCorrect(true);
    }

    if (country.length <= 1) {
      setCountryCorrect(true);
    }

    if (title.length <= 1) {
      setTitleCorrect(true);
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
      !isValidIsraeliPhoneNumber(phone) ||
      description.length < 10 ||
      city.length < 1 ||
      street.length < 1
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

    if (image.length < 2) {
      image = "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png";
    }
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions

    setLoadCircle(true);

    addCard({ title, subTitle, description, phone, email, web, image, country, city, street, houseNumber, zip })
      .then(() => {
        setTimeout(() => {
          navigate("/");
        }, 2000);
      })
      .catch((err) => {
        console.log(err.message);
      });
  };

  return (
    <Container
      sx={{
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Box onKeyUp={() => validate()} component="form" sx={{ ...addSxStyle }}>
        <Title mainText={"Create Card"} subText="Create your new card" />
        <Box display={"flex"} className="myBox">
          <TextField
            autoFocus={true}
            label={titleLabel}
            variant="outlined"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            error={fieldTitleErr}
            helperText={titleErr}
          />

          <TextField
            label={subTitleLabel}
            variant="outlined"
            value={subTitle}
            onChange={(e) => setSubTitle(e.target.value)}
            error={fieldSubTitleErr}
            helperText={subTitleErr}
          />
        </Box>

        <Box display={"flex"} className="myBox">
          <TextField
            label={phoneLabel}
            variant="outlined"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            error={fieldPhoneErr}
            helperText={phoneErr}
          />

          <TextField
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
            label={descriptionLabel}
            variant="outlined"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            error={fieldDescriptionErr}
            helperText={descriptionErr}
          />

          <TextField
            label={webLabel}
            variant="outlined"
            value={web}
            onChange={(e) => setweb(e.target.value)}
            error={fieldwebErr}
            helperText={webErr}
          />
        </Box>
        <Box display={"flex"} className="myBox">
          <TextField label={"Image"} variant="outlined" value={image} onChange={(e) => setImage(e.target.value)} />

          <Autocomplete
            disablePortal
            value={countrySelect}
            options={countryList}
            inputValue={country}
            onInputChange={(event, newInputValue) => {
              setCountry(newInputValue);
            }}
            sx={{ width: 620 }}
            renderInput={(params) => (
              <TextField
                {...params}
                label={countryLabel}
                variant="outlined"
                value={country}
                error={fieldCountryErr}
                helperText={countryErr}
              />
            )}
          />
        </Box>
        <Box display={"flex"} className="myBox">
          <TextField
            label={cityLabel}
            variant="outlined"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            error={fieldCityErr}
            helperText={cityErr}
          />

          <TextField
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
            label={"House number"}
            variant="outlined"
            value={houseNumber}
            onChange={(e) => setHouseNumber(e.target.value)}
          />
          <TextField label={"Zip"} variant="outlined" value={zip} onChange={(e) => setZip(e.target.value)} />
        </Box>

        <Box>
          <Button sx={{ width: "50%" }}>Cancel</Button>
          <Button
            onClick={() => {
              clearAllFieldsFunc();
            }}
            sx={{ width: "50%" }}
          >
            <AutorenewIcon />
          </Button>
        </Box>
        <AuthButton handleClick={() => handleClick}>Submit {loadCircle && <Circle _size={30} />} </AuthButton>
      </Box>
    </Container>
  );
}

export default CreatCardPage;
