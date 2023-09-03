import * as React from "react";
import IconButton from "@mui/material/IconButton";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import CallIcon from "@mui/icons-material/Call";

import { Bcard } from "../../services/Interfaces";
// modal

import ModeEditIcon from "@mui/icons-material/ModeEdit";

import { getUser, verifyUiAdmin, verifyToken } from "../../auth/TokenManager";
import { useNavigate } from "react-router-dom";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { UserContext } from "../../hooks/UserContext";
import GerenralModal from "./GeneralModal";

interface Props extends Bcard {
  user_id?: string;
  onDelete: Function;
  onToggleFavorit: Function;
  favoritePage: boolean;
  rootLink?: boolean;
  index: number;
  alt?: string;
}

function BuisnessCardWide({
  _id,
  user_id,
  title,
  subTitle,
  phone,
  image,
  onDelete,
  onToggleFavorit,
  favoritePage,
  favorites,
  alt,
  rootLink = false,
}: Props) {
  const { userData } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [isRedHeart, setIsRedHeart] = React.useState(false);
  const navigate = useNavigate();

  const theme = useTheme();
  const mdAndUp = useMediaQuery(theme.breakpoints.up("md"));

  // General functions
  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handlePhoneCall = (phoneNumber: string | null | undefined) => {
    window.location.href = `tel:${phoneNumber}`;
  };

  const ifCardBelongToThisUserFunc = (userId: string | null | undefined) => {
    if (userId === undefined) return false;

    if (userId === user_id) {
      return true;
    }
    return false;
  };
  const toggleHighlight = () => {
    setIsRedHeart(!isRedHeart);
  };

  // useEffect

  React.useEffect(() => {
    const ifCardIsFavorite = (userId: string | null | undefined) => {
      favorites?.forEach((id) => {
        if (id === userId) {
          setIsRedHeart(true);
        }
      });
    };
    const userObject = getUser();
    if (userObject) {
      ifCardIsFavorite(userObject._id);
    }
  }, [favorites]);

  return (
    <>
      <div>
        <div className="main-wrap" style={{ width: mdAndUp ? "70vw" : "80vw" }}>
          <div className="pic">
            <img
              className="pic"
              src={
                image && image.startsWith("https")
                  ? image
                  : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"
              }
              alt="project"
              style={{ cursor: "pointer" }}
              onClick={() => {
                navigate(!rootLink ? `view-card/${_id}` : `/view-card/${_id}`);
              }}
              // className="proj-image"
            ></img>
          </div>
          <div className="left-wrap">
            <div className="text-wrap">
              <div
                style={{ cursor: "pointer" }}
                onClick={() => {
                  navigate(!rootLink ? `view-card/${_id}` : `/view-card/${_id}`);
                }}
              >
                <h3>{title}</h3>
                <p className="p-wrap">{subTitle}</p>
              </div>
              <div className="icon-wrap">
                {verifyToken() && (
                  <IconButton
                    aria-label="add to favorites"
                    onClick={() => {
                      onToggleFavorit(_id);
                      toggleHighlight();
                    }}
                  >
                    <FavoriteIcon sx={{ color: isRedHeart ? "red" : "" }} />
                  </IconButton>
                )}

                <IconButton
                  aria-label="call"
                  onClick={() => {
                    handlePhoneCall(phone);
                  }}
                >
                  <CallIcon />
                </IconButton>
                {verifyUiAdmin(userData!) || ifCardBelongToThisUserFunc(userData?._id) ? (
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      navigate(!rootLink ? `edit-card/${_id}` : `/edit-card/${_id}`);
                    }}
                  >
                    <ModeEditIcon />
                  </IconButton>
                ) : (
                  <span></span>
                )}

                <Box>
                  {verifyUiAdmin(userData!) || ifCardBelongToThisUserFunc(userData?._id) ? (
                    <IconButton
                      onClick={() => {
                        handleClickOpen();
                      }}
                      aria-label="delete"
                    >
                      <DeleteIcon />
                    </IconButton>
                  ) : (
                    <span></span>
                  )}
                </Box>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ================== Modal Dialog ======================= */}
      <GerenralModal
        open={open}
        handleCloseFunc={handleClose}
        onDeleteFunc={() => {
          onDelete(_id);
        }}
        title={"DELETE , deleting card from the database"}
      >
        You're Should you want to Delete "{title}" card?
      </GerenralModal>
    </>
  );
}

export default BuisnessCardWide;
