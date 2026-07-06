import {
  Box,
  Stack,
  Typography,
  IconButton,
  TextField,
  InputAdornment,
  useTheme,
  Skeleton,
  CircularProgress,
} from "@mui/material";
import { Link, Lock, PaperPlaneTilt, Spinner, X } from "@phosphor-icons/react";
import image from "../../assets/icon.svg";
import { IOSSwitch } from "../dashboard/Profile";
import {
  addmail,
  getUserMail,
} from "../../redux/features/mailbox/mailboxSlice";
import { useContext, useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getUser,
  logout,
} from "../../redux/features/auth/authSlice";
import { useLocation, useNavigate } from "react-router-dom";
import { ColorModeContext, tokens } from "../../theme";
import { useSSEConnection } from "../../hooks/useSSEConnection";

const Chat = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const colors = tokens(theme.palette.mode);

  const { pathname } = useLocation();
  const pathnameRef = useRef(pathname);

  useEffect(() => {
    pathnameRef.current = pathname;
  }, [pathname]);

  const { user, isLoading, isLoggedIn } = useSelector((state) => state.auth);

  //use sseCONNECTION here
  useSSEConnection(user, pathnameRef);

  const colorMode = useContext(ColorModeContext);

  const [checked, setChecked] = useState(theme.palette.mode === "dark");

  // Handle switch change
  const changeManualAssetMode = (event) => {
    const { checked: isChecked } = event.target;

    // Optionally update any local state if needed
    setChecked(isChecked);

    // Dispatch the action with a slight delay
    setTimeout(() => {
      colorMode.toggleColorMode();
    }, 400);
  };

  useEffect(() => {
    setChecked(theme.palette.mode === "dark");
  }, [theme.palette.mode]);

  const [uploadLoading, setUploadLoading] = useState(false);

  const { isLoading: userMailLoader, selectedMail } = useSelector(
    (state) => state.mailbox,
  );

  // console.log(userMailLoader)

  if (!isLoading && isLoggedIn === false) {
    navigate("/");
  }

  useEffect(() => {
    dispatch(getLoginStatus());
  }, [dispatch, isLoggedIn]);

  useEffect(() => {
    if (isLoggedIn && user === null) {
      dispatch(getUser());
    }
  }, [dispatch, isLoggedIn, user]);

  const { allMails } = useSelector((state) => state.mailbox);
  // console.log(user.email);

  useEffect(() => {
    // if (allMails.length === 0) {
    dispatch(getUserMail());
    // }
  }, [dispatch]);

  const [message, setMessage] = useState("");

  const messagesEndRef = useRef(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
    });
  }, [allMails]);

  const handleFormSubmit = async () => {
    // console.log(message);

    setUploadLoading(true);
    // alert(inputs);

    const formData = {
      userId: user._id,
      messages: [
        {
          to: "Support Team",
          from: user?.email,
          subject: "Message Subject",
          content: message,
        },
      ],
    };

    console.log("formData:", formData);
    await dispatch(addmail(formData));
    setMessage("");
    setUploadLoading(false);
  };

  return (
    <Box
      // flex={1}
      bgcolor={"#111827"}
      display={"flex"}
      justifyContent={"center"}
      width={"100%"}
      height={"100vh"}
      overflow={"auto"}
      p={{ xs: "0px", lg: 5 }}
    >
      {/* Form Box */}
      <Box
        display={"flex"}
        flexDirection={"column"}
        bgcolor={"#151a22"}
        width={{ xs: "100%", lg: "450px" }}
        borderRadius={{ xs: "none", md: 4 }}
        overflow={"hidden"}
        border={"1px solid #30363d"}
        borderTop={"2px solid skyblue"}
      >
        {/* Form Box Header */}
        <Box
          width={"100%"}
          height={"70px"}
          bgcolor={"#1c2533"}
          borderBottom={"1px solid #30363d"}
          display={"flex"}
          justifyContent={"space-between"}
          alignItems={"center"}
          px={1}
        >
          <Stack direction={"row"} alignItems={"center"} spacing={1}>
            <Stack direction={"row"} spacing={1} justifyContent={"center"}>
              <Box>
                <img
                  src={image}
                  alt="profileimage"
                  width={"40px"}
                  height={"40px"}
                  style={{
                    borderRadius: "50%",
                    border: "1px solid grey",
                  }}
                />
              </Box>
              <Stack>
                <Typography variant="body2" fontWeight={"600"}>
                  Crpto Support
                </Typography>
                <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
                  <Lock size={16} weight="regular" color="gray" />
                  <Typography
                    variant="caption"
                    fontWeight={"500"}
                    color={"gray"}
                  >
                    Secured session
                  </Typography>
                </Stack>
              </Stack>
            </Stack>
          </Stack>
          <Stack
            direction={"row"}
            justifyContent={"center"}
            alignItems={"center"}
            spacing={0.5}
          >
            <Typography
              variant="caption"
              fontWeight={"500"}
              bgcolor={"#323a46"}
              p={"2px 8px"}
              borderRadius={9}
              color={"#acafb4"}
            >
              secured chat
            </Typography>
            <IOSSwitch
              checked={checked}
              disabled

              // onChange={changeManualAssetMode}
              // name="switch1"
            />{" "}
            <IconButton
              sx={{
                backgroundColor: "transparent",
                borderRadius: "10px",
                padding: 0.5,
              }}
              onClick={() => dispatch(logout())}
            >
              <X size={24} weight="regular" />
            </IconButton>
          </Stack>
        </Box>

        {/* Form Box Main Content */}
        <Stack
          flex={1}
          overflow={"auto"}
          display={"flex"}
          mb={2}
          mt={1}
          direction={"column"}
          spacing={2}
          alignItems={"center"}
          // border={"2px solid green"}
        >
          {userMailLoader ? (
            <Stack direction={"column"} spacing={2} width={"100%"} p={2}>
              <Skeleton
                variant="rectangular"
                width={"70%"}
                height={"60px"}
                sx={{ borderRadius: 3 }}
              />
              <Skeleton
                variant="rectangular"
                width={"70%"}
                height={"60px"}
                sx={{ borderRadius: 3, alignSelf: "flex-end" }}
              />
              <Skeleton
                variant="rectangular"
                width={"70%"}
                height={"60px"}
                sx={{ borderRadius: 3 }}
              />
            </Stack>
          ) : (
            <Box
              sx={{
                width: "100%",
                bgcolor: "#111726",
                height: "100%",
                p: 2,
              }}
            >
              {/* Start of welcome auto Message */}
              <Stack
                direction={"row"}
                spacing={2}
                justifyContent={"center"}
                alignItems={"flex-end"}
                mb={2}
                mr={5}
              >
                <Box>
                  <img
                    src={image}
                    alt="profileimage"
                    width={"40px"}
                    height={"40px"}
                    style={{
                      borderRadius: "50%",
                      border: "1px solid grey",
                    }}
                  />
                </Box>

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-start",
                    mb: 2,
                  }}
                >
                  <Stack
                    direction={"column"}
                    sx={{
                      // maxWidth: "75%",
                      px: 1.5,
                      py: 1,
                      borderRadius: 3,
                      bgcolor: "#1b263b",
                      color: "white",
                      boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
                      position: "relative",
                      wordBreak: "break-word",
                    }}
                  >
                    <Typography
                      variant="body2"
                      sx={{
                        // pr: 8,
                        whiteSpace: "pre-wrap",
                      }}
                    >
                      {
                        "Welcome aboard! This is Live Support. We're here 24/7 to ensure your experience is seamless. Tell me how I can support you today"
                      }
                    </Typography>

                    <Typography
                      variant="caption"
                      sx={{
                        alignSelf: "flex-end",
                        color: "lightgrey",
                        fontSize: "11px",
                      }}
                    >
                      21:0
                    </Typography>
                  </Stack>
                </Box>
              </Stack>
              {/* End of welcome auto Message */}

              {/* Start of messages array */}
              {allMails &&
                allMails?.[0]?.messages.length > 0 &&
                allMails?.[0]?.messages?.map((mail) => {
                  // console.log(user?.email);
                  return (
                    <ChatMessage
                      key={mail._id}
                      message={mail.content}
                      time={new Date(mail.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      isMine={mail.from === user?.email}
                    />
                  );
                })}

              <Box ref={messagesEndRef} />
            </Box>
          )}
        </Stack>

        {/* Footer */}
        <Stack
          spacing={2}
          width={"100%"}
          height={"130px"}
          // bgcolor={"#1c2533"}
          borderTop={"1px solid #30363d"}
          justifyContent={"center"}
          alignItems={"center"}
          px={2}
        >
          <Stack spacing={2} width={"100%"}>
            <TextField
              fullWidth
              size="medium"
              variant="outlined"
              type="text"
              // label="Email Address"
              name="message"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Link weight="thin" size={26} />
                  </InputAdornment>
                ),
                endAdornment: (
                  <InputAdornment position="end">
                    <IconButton
                      sx={{
                        bgcolor: "#5398f9",
                        borderRadius: "10px",
                        border: "1px solid lightgray",
                      }}
                      onClick={handleFormSubmit}
                      disabled={uploadLoading || message.length < 1}
                    >
                      {uploadLoading ? (
                        <CircularProgress color="inherit" size={20} />
                      ) : (
                        <PaperPlaneTilt size={22} weight="fill" color="#fff" />
                      )}
                    </IconButton>
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: "15px",
                  bgcolor: "#1d2735",
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "light" ? "black" : "grey", // Change the border color to red
                  },
                  "&:hover .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red on hover
                  },
                  "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                    borderColor:
                      theme.palette.mode === "light" ? "black" : "grey", // Ensure it stays red when focused
                  },
                },
              }}
            />
          </Stack>
          <Typography variant="caption" color={"gray"}>
            End-to-end encrypted — Powered by CryptoSupport{" "}
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Chat;

const ChatMessage = ({ message, time, isMine = false }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: isMine ? "flex-end" : "flex-start",
        mb: 2,
      }}
    >
      <Stack
        direction={"column"}
        sx={{
          // maxWidth: "75%",
          px: 1.5,
          py: 1,
          borderRadius: isMine ? "8px 8px 0px 8px" : "8px 8px 8px 0px",
          bgcolor: isMine ? "#3b82f6" : "#1b263b",
          color: "white",
          boxShadow: "0 1px 1px rgba(0,0,0,0.15)",
          position: "relative",
          wordBreak: "break-word",
          ml: isMine ? 15 : 7,
          mr: isMine ? 0 : 5,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            // pr: 8,
            whiteSpace: "pre-wrap",
          }}
        >
          {message}
        </Typography>

        <Typography
          variant="caption"
          sx={{
            alignSelf: "flex-end",
            // position: "absolute",
            // bottom: 6,
            // right: 10,
            color: "lightgrey",
            fontSize: "11px",
          }}
        >
          {time}
        </Typography>
      </Stack>
    </Box>
  );
};
