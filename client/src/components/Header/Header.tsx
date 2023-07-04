import * as React from "react";
import { styled, alpha } from "@mui/material/styles";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import Badge from "@mui/material/Badge";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import MenuIcon from "@mui/icons-material/Menu";
import SearchIcon from "@mui/icons-material/Search";
import AccountCircle from "@mui/icons-material/AccountCircle";
import MoreIcon from "@mui/icons-material/MoreVert";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import LogoutIcon from "@mui/icons-material/Logout";
import LoginIcon from "@mui/icons-material/Login";
import NavTabs from "./NavTabs";
import { Drawer, useMediaQuery, useTheme } from "@mui/material";
import { SearchContext } from "../../hooks/SearchContext";
import AppTitle from "../AppTitle";
import DrawerTabs from "./DrawerTabs";
import { removeUser, verifyUiAdmin, verifyToken, verifyUiToken } from "../../auth/TokenManager";
import "./../../App.css";
import { Link, useNavigate } from "react-router-dom";
import { UserContext } from "../../hooks/UserContext";
import { palette } from "../../plugins/mui";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 0.15),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.25),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  [theme.breakpoints.up("sm")]: {
    marginLeft: theme.spacing(3),
    width: "auto",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 1, 1, 0),
    // vertical padding + font size from searchIcon
    paddingLeft: `calc(1em + ${theme.spacing(4)})`,
    transition: theme.transitions.create("width"),
    width: "80%",
    [theme.breakpoints.up("md")]: {
      width: "40ch",
    },
  },
}));

interface Props {
  themeToggle: any;
}

export default function Header({ themeToggle }: Props) {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
  const [mobileMoreAnchorEl, setMobileMoreAnchorEl] = React.useState<null | HTMLElement>(null);
  // const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const mdAndUp = useMediaQuery(theme.breakpoints.up("md"));
  const isMenuOpen = Boolean(anchorEl);
  const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);
  const { userData } = React.useContext(UserContext);
  const navigate = useNavigate();

  const handleProfileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleMobileMenuClose = () => {
    setMobileMoreAnchorEl(null);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
    handleMobileMenuClose();
  };

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const handleMobileMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setMobileMoreAnchorEl(event.currentTarget);
  };

  const { searchValue, setSearchValue } = React.useContext(SearchContext);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchValue(event.target.value);
  };

  const drawer = <DrawerTabs />;

  const menuId = "primary-search-account-menu";
  const renderMenu = (
    <Menu
      anchorEl={anchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={menuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMenuOpen}
      onClose={handleMenuClose}
    >
      {verifyToken()
        ? ["Profile", "My Account"].map((item) => (
            <MenuItem key={item} onClick={handleMenuClose} component={Link} to={item} disabled={item === "My Account"}>
              {item}
            </MenuItem>
          ))
        : [
            { link: "/sign", title: "Please SignUp" },
            { link: "/login", title: "Have account ? Log!" },
            { link: "/about", title: "About" },
          ].map((item) => (
            <MenuItem key={item.title} component={Link} to={item.link} onClick={handleMenuClose}>
              {item.title}
            </MenuItem>
          ))}
    </Menu>
  );

  const mobileMenuId = "primary-search-account-menu-mobile";
  const renderMobileMenu = (
    <Menu
      anchorEl={mobileMoreAnchorEl}
      anchorOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      id={mobileMenuId}
      keepMounted
      transformOrigin={{
        vertical: "top",
        horizontal: "right",
      }}
      open={isMobileMenuOpen}
      onClose={handleMobileMenuClose}
    >
      {/* Item 1 */}
      <MenuItem
        onClick={() => {
          navigate("/login");
        }}
      >
        <IconButton size="large" color="inherit">
          <LoginIcon />
        </IconButton>
        <p>Log-In</p>
      </MenuItem>
      {/* Item 2 */}
      <MenuItem
        onClick={() => {
          removeUser();
        }}
      >
        <IconButton size="large" color="inherit">
          <LogoutIcon />
        </IconButton>
        <p>Log-Out</p>
      </MenuItem>
      {/* Item 3 */}
      <MenuItem onClick={handleProfileMenuOpen}>
        <IconButton>
          <AccountCircle />
        </IconButton>
        <p>Profile</p>
      </MenuItem>

      {/* Item 4 */}

      <MenuItem
        onClick={() => {
          themeToggle();
        }}
      >
        <IconButton>{theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}</IconButton>
        <p>Mode</p>
      </MenuItem>

      {/* Item 5 */}

      {verifyUiAdmin(userData!) && (
        <MenuItem
          onClick={() => {
            navigate("/sandBox");
          }}
        >
          <IconButton size="large" color="inherit">
            {/* <LoginIcon /> */}
            <AdminPanelSettingsIcon sx={{ color: palette.special.main }} />
          </IconButton>
          <p>Admin</p>
        </MenuItem>
      )}
    </Menu>
  );

  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar sx={{ borderBottomLeftRadius: "35px", borderBottomRightRadius: "35px" }} position="static">
        <Toolbar>
          {!mdAndUp && (
            <IconButton
              onClick={() => setDrawerOpen(true)}
              size="large"
              edge="start"
              color="inherit"
              aria-label="open drawer"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h3" noWrap component="div" sx={{ display: { xs: "none", sm: "block" }, minWidth: "140px" }}>
            <AppTitle size={"24px"} />
          </Typography>
          <Search>
            <SearchIconWrapper>
              <SearchIcon />
            </SearchIconWrapper>
            <StyledInputBase
              onChange={handleSearchChange}
              placeholder="Search…"
              value={searchValue}
              sx={{ width: "190px" }}
              inputProps={{ "aria-label": "search" }}
            />
          </Search>
          {mdAndUp ? (
            <>
              <NavTabs />
            </>
          ) : (
            <>
              <Drawer
                anchor={"left"}
                open={drawerOpen}
                onClose={() => setDrawerOpen(false)}
                PaperProps={{
                  sx: {
                    width: "45%",
                  },
                }}
              >
                {drawer}
              </Drawer>
            </>
          )}

          <Box sx={{ flexGrow: 1 }} />
          <Box sx={{ display: { xs: "none", md: "flex" } }}>
            <IconButton
              sx={{ color: "white" }}
              onClick={() => {
                themeToggle();
              }}
            >
              {theme.palette.mode === "dark" ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>

            <IconButton
              aria-label="account of current user"
              aria-controls={menuId}
              aria-haspopup="true"
              onClick={handleProfileMenuOpen}
              color="inherit"
            >
              {!verifyUiToken(userData!) ? (
                <Badge badgeContent={"Hi"} color="error">
                  <AccountCircle className="user-icon" />
                </Badge>
              ) : (
                <AccountCircle className="user-icon" sx={{ color: palette.special.main }} />
              )}
            </IconButton>
          </Box>
          <Box sx={{ display: { xs: "flex", md: "none" } }}>
            <IconButton
              edge={false}
              size="large"
              aria-label="show more"
              aria-controls={mobileMenuId}
              aria-haspopup="true"
              onClick={handleMobileMenuOpen}
              color="inherit"
            >
              <MoreIcon />
            </IconButton>
          </Box>
        </Toolbar>
      </AppBar>

      {renderMobileMenu}
      {renderMenu}
    </Box>
  );
}
