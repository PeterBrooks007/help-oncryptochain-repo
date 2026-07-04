import { Stack, TextField, Typography } from "@mui/material";
import React from "react";
import {
  Button,
  CircularProgress,
  InputAdornment,
  useMediaQuery,
} from "@mui/material";
import { useTheme } from "@emotion/react";
import { Link as RouterLink, useNavigate } from "react-router-dom";
import {
  EnvelopeSimple,
  ChatCircleDots,
  Lock,
  User,
} from "@phosphor-icons/react";
import { useContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import { validateEmail } from "../../utils/index.js";
import { login, RESET_AUTH } from "../../redux/features/auth/authSlice.js";
import UseWindowSize from "../../hooks/UseWindowSize.jsx";
// import LogoImg from "./../../assets/opengraph.png";
import { ColorModeContext, tokens } from "../../theme.js";

const ChatLoginFormComponent = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);
  const size = UseWindowSize();

  const savedColorMode = localStorage.getItem("colorMode") || null;

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (e) => {
    setAnchorEl(e.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [email, setEmail] = useState("");
  const [name, setName] = useState("");

  const { user, isLoading, isLoggedIn, isSuccess, is2FARequired } = useSelector(
    (state) => state.auth,
  );

  const loginUser = async (e) => {
    e.preventDefault();
    if (!email || !name) {
      return toast.error("All fields are required");
    }
    if (!validateEmail(email)) {
      return toast.error("Please enter a valid email address");
    }

    const userData = {
      email: email.toLowerCase().trim(),
      firstname: name,
    };
    await dispatch(login(userData));
  };

  useEffect(() => {
    // if (isSuccess && isLoggedIn && is2FARequired) {
    //   navigate("/auth/2faAuthentication");
    //   return;
    // }

    if (isSuccess && isLoggedIn && user && user?.role === "admin") {
      navigate("/admin");
      return;
    }

    // if (isSuccess && isLoggedIn && user && user?.isEmailVerified === false) {
    //   navigate("/auth/verify-email");
    //   dispatch(RESET_AUTH());
    //   return;
    // }

    // if (
    //   isSuccess &&
    //   isLoggedIn &&
    //   user &&
    //   (user?.isIdVerified === "NOT VERIFIED" ||
    //     user?.isIdVerified === "PENDING")
    // ) {
    //   navigate("/auth/account-setup");
    //   dispatch(RESET_AUTH());
    //   return;
    // }

    if (isSuccess && isLoggedIn && user && user?.role === "customer") {
      navigate("/chat");
      dispatch(RESET_AUTH());
      return;
    }
  }, [isLoggedIn, isSuccess, dispatch, navigate, user]);

  return (
    <form onSubmit={loginUser}>
      <Stack spacing={2}>
        <TextField
          fullWidth
          size="medium"
          variant="outlined"
          type="text"
          // label="Password"
          placeholder="Enter Your Name"
          name="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <User
                  weight="thin"
                  size={28}
                  color={theme.palette.mode === "light" ? "grey" : "grey"}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Change the border color to red
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red when focused
              },
              "&:before": {
                content: '""',
                position: "absolute",
                height: "95%",
                width: "1px",
                backgroundColor:
                  theme.palette.mode === "light" ? "grey" : "grey.800", // Border color
                left: "50px", // Adjust this value based on the width of the `startAdornment`
                zIndex: 1,
              },
              "& .MuiInputBase-input": {
                paddingLeft: "16px", // Adjust padding to ensure alignment
              },
            },
          }}
        />

        <TextField
          // autoFocus
          fullWidth
          size="medium"
          variant="outlined"
          type="email"
          // label="Email Address"
          name="email"
          placeholder="Email Address"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <EnvelopeSimple
                  weight="thin"
                  size={26}
                  color={theme.palette.mode === "light" ? "grey" : "grey"}
                />
              </InputAdornment>
            ),
          }}
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: "10px",
              "& .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Change the border color to red
              },
              "&:hover .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red on hover
              },
              "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                borderColor: theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red when focused
              },
              "&:before": {
                content: '""',
                position: "absolute",
                height: "95%",
                width: "1px",
                backgroundColor:
                  theme.palette.mode === "light" ? "grey" : "grey.800", // Border color
                left: "50px", // Adjust this value based on the width of the `startAdornment`
                zIndex: 1,
              },
              "& .MuiInputBase-input": {
                paddingLeft: "16px", // Adjust padding to ensure alignment
              },
            },
          }}
        />

        <Button
          fullWidth
          color="inherit"
          size="large"
          type="submit"
          variant="contained"
          disabled={isLoading && true}
          startIcon={<ChatCircleDots size={28} weight="regular" />}
          sx={{
            bgcolor: "#5398f9",
            borderRadius: "10px",
            padding: "15px",
            fontWeight: "600",
            color: (theme) =>
              theme.palette.mode === "light" ? "common.white" : "white",
            "&:hover": {
              bgcolor: "green",
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "common.white"
                  : "common.white",
            },
            "&:active": {
              bgcolor: "darkgreen !important", // Adjust color for active state
              color: (theme) =>
                theme.palette.mode === "light"
                  ? "common.white"
                  : "common.white",
            },
          }}
        >
          {isLoading ? <CircularProgress size={28} /> : "Start Conversation"}
        </Button>

        {/* <Typography textAlign={"center"} color={"#3b82f6"}>Connecting to secure support...</Typography> */}
      </Stack>
    </form>
  );
};

export default ChatLoginFormComponent;
