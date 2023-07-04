import * as React from "react";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Avatar from "@mui/material/Avatar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import FavoriteIcon from "@mui/icons-material/Favorite";
import DeleteIcon from "@mui/icons-material/Delete";
import PreviewIcon from "@mui/icons-material/Preview";
import CallIcon from "@mui/icons-material/Call";

import { Bcard } from "../../services/Interfaces";
// modal

import ModeEditIcon from "@mui/icons-material/ModeEdit";

import { getUser, verifyUiAdmin, verifyToken } from "../../auth/TokenManager";
import { palette } from "./../../plugins/mui";
import { useNavigate } from "react-router-dom";
import { Box } from "@mui/material";
import { UserContext } from "../../hooks/UserContext";
import GerenralModal from "./GeneralModal";

interface Props extends Bcard {
  user_id?: string;
  onDelete: Function;
  onToggleFavorit: Function;
  favoritePage: boolean;
  index: number;
}

function BuisnessCard({
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
}: Props) {
  const { userData } = React.useContext(UserContext);
  const [open, setOpen] = React.useState(false);
  const [isRedHeart, setIsRedHeart] = React.useState(false);
  const navigate = useNavigate();

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
      <Card
        sx={{
          maxWidth: 300,
          minWidth: 300,
          minHeight: 430,
          margin: "10px",
          borderTopLeftRadius: "15px",
          borderTopRightRadius: "15px",
          boxShadow: " 0px 8px 16px 0px rgba(0,0,0,0.5)",
          "@media (max-width: 700px)": {
            maxwidth: 250,
            minwidth: 250,
            minheight: 360,
          },
        }}
        className="card-hover"
      >
        <CardHeader
          avatar={
            <Avatar
              sx={{
                backgroundColor: palette.secondary.main,
              }}
              aria-label="recipe"
            >
              {title ? title[0] : "U"}
            </Avatar>
          }
          title={title}
        />
        <CardMedia
          component="img"
          height="194"
          image={image ? image : "https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png"}
          alt=""
          sx={{ cursor: "pointer" }}
          onClick={() => {
            navigate(`view-card/${_id}`);
          }}
        />
        <CardContent>
          <Typography variant="body2" color="text.secondary">
            {subTitle}
          </Typography>
        </CardContent>

        {!favoritePage && (
          <CardActions disableSpacing>
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
                  navigate(`edit-card/${_id}`);
                }}
              >
                <ModeEditIcon />
              </IconButton>
            ) : (
              <span></span>
            )}

            <Box>
              <IconButton
                onClick={() => {
                  navigate(`view-card/${_id}`);
                }}
              >
                <PreviewIcon />
              </IconButton>
              {verifyUiAdmin(userData!) && (
                <IconButton
                  onClick={() => {
                    handleClickOpen();
                  }}
                  aria-label="delete"
                >
                  <DeleteIcon />
                </IconButton>
              )}
            </Box>
          </CardActions>
        )}
      </Card>

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

export default BuisnessCard;
