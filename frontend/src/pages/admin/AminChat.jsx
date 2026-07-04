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
  getAllMail,
  getUserMail,
} from "../../redux/features/mailbox/mailboxSlice";
import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getLoginStatus,
  getSingleUser,
  getUser,
} from "../../redux/features/auth/authSlice";
import { useNavigate, useParams } from "react-router-dom";

const AdminChat = () => {
  const theme = useTheme();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { id } = useParams();

  const { isSemiLoading, isLoading, allMails } = useSelector(
    (state) => state.mailbox,
  );

  const { user, isLoggedIn, singleUser } = useSelector((state) => state.auth);

  const selectedMail = allMails?.filter((mail) => mail.userId?._id === id);

  // console.log(selectedMail);

  const [uploadLoading, setUploadLoading] = useState(false);

  //   const { user, isLoading, isLoggedIn } = useSelector((state) => state.auth);

  useEffect(() => {
    dispatch(getSingleUser(id));
  }, [dispatch, id]);

  useEffect(() => {
    // if (allMails.length === 0) {
    dispatch(getAllMail());
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
      userId: id,
      messages: [
        {
          from: "Support Team",
          to: singleUser?.email || "",
          subject: "Message Subject",
          content: message,
        },
      ],
    };

    // console.log("formData:", formData);
    await dispatch(addmail(formData));
    // dispatch(getAllMail());

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
                  {selectedMail?.[0]?.userId?.firstname}
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
              CryptoSupport
            </Typography>
            <IOSSwitch checked={true} disabled />
            <IconButton
              sx={{
                backgroundColor: "transparent",
                borderRadius: "10px",
                padding: 0.5,
              }}
              onClick={() => navigate(`/`)}
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
          {isLoading ? (
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
                pt: 0,
              }}
            >
              <Typography
                variant="body1"
                pb={2}
                textAlign={"center"}
                fontSize={12}
              >
                {selectedMail?.[0]?.userId?.email}
              </Typography>

              {/* Start of messages array */}
              {selectedMail &&
                selectedMail?.[0]?.messages.length > 0 &&
                selectedMail?.[0]?.messages?.map((mail) => {
                  // console.log(user?.email);
                  return (
                    <ChatMessage
                      key={mail._id}
                      message={mail.content}
                      time={new Date(mail.createdAt).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                      isMine={mail.from !== singleUser?.email}
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
                      sx={{ bgcolor: "#5398f9", borderRadius: "10px" }}
                      onClick={handleFormSubmit}
                      disabled={isSemiLoading}
                    >
                      {isSemiLoading ? (
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

export default AdminChat;

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
          ml: isMine ? 15 : 1,
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
