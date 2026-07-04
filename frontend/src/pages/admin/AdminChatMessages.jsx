import {
  Box,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Skeleton,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import { Gear, Headset, Lock } from "@phosphor-icons/react";
import React, { useContext, useEffect, useState } from "react";
import { IOSSwitch } from "../dashboard/Profile";
import image from "../../assets/admin_IMG_1550.jpeg";
import StyledBadge from "../../components/StyledBadge";
import { useDispatch, useSelector } from "react-redux";
import {
  adminMarkMailAsReadOnView,
  getAllMail,
} from "../../redux/features/mailbox/mailboxSlice";
import { shortenText } from "../../utils";
import { useNavigate } from "react-router-dom";
import { logout } from "../../redux/features/auth/authSlice";
import { ColorModeContext, tokens } from "../../theme";
import UseWindowSize from "../../hooks/UseWindowSize";

const AdminChatMessages = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();
  const size = UseWindowSize();

  const colors = tokens(theme.palette.mode);

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

  const { isSemiLoading, isLoading, allMails } = useSelector(
    (state) => state.mailbox,
  );

  const {
    user,
    isLoading: authLoading,
    isLoggedIn,
  } = useSelector((state) => state.auth);

  useEffect(() => {
    if (allMails.length === 0) {
      dispatch(getAllMail());
    }
  }, [dispatch, allMails.length]);

  // console.log(allMails);

  // const allMailsBox = allMails
  //   ? [...allMails].sort((a, b) => {
  //       const aDate = new Date(a.messages?.[0]?.createdAt || a.createdAt);
  //       const bDate = new Date(b.messages?.[0]?.createdAt || b.createdAt);

  //       return bDate - aDate; // newest first
  //     })
  //   : [];

  // const allMailsBox = allMails
  //   ? [...allMails].sort((a, b) => {
  //       const aLastMessage = a.messages?.[a.messages.length - 1];
  //       const bLastMessage = b.messages?.[b.messages.length - 1];

  //       const aDate = new Date(aLastMessage?.createdAt || a.createdAt);
  //       const bDate = new Date(bLastMessage?.createdAt || b.createdAt);

  //       return bDate - aDate;
  //     })
  //   : [];

  const allMailsBox = allMails
    ? [...allMails].sort((a, b) => {
        const aLastMessage = a.messages?.[a.messages.length - 1];
        const bLastMessage = b.messages?.[b.messages.length - 1];

        // Unread conversations first
        if (aLastMessage?.isRead !== bLastMessage?.isRead) {
          return aLastMessage?.isRead ? 1 : -1;
        }

        // Then sort by latest message date
        const aDate = new Date(aLastMessage?.createdAt || a.createdAt);
        const bDate = new Date(bLastMessage?.createdAt || b.createdAt);

        return bDate - aDate;
      })
    : [];

  const unreadCount = allMails?.reduce((total, mailbox) => {
    const unreadMessages =
      mailbox.messages?.filter(
        (message) => !message.isRead && message.from !== "Support Team",
      ).length || 0;

    return total + unreadMessages;
  }, 0);

  // handleMarkasreadOnView
  const handleMarkasreadOnView = async (userId) => {
    const messageData = {
      userId,
      from: "inboxComponent",
    };

    await dispatch(adminMarkMailAsReadOnView({ messageData }));
  };

  // handleJoin
  const handleJoin = (userId) => {
    // console.log("userId:", userId, "messageId:", messageId);

    handleMarkasreadOnView(userId);
    navigate(`/admin/chat/${userId}`);
  };

  // handleDelete
  const handleDelete = (id) => {
    // navigate(`/admin/chat/${id}`);
  };

  // Delete Trader Drawer
  const [openDeleteUserDrawer, setDeleteUserDrawer] = useState(false);
  const [selectedUserID, setSelectedUserID] = useState(null);

  // console.log(selectedTraderID);

  const handleClickDelete = () => {
    setDeleteUserDrawer(true);
  };

  const handleCloseDelete = () => {
    setDeleteUserDrawer(false);
  };

  return (
    <Box
      width={"100%"}
      height={"100vh"}
      overflow={"auto"}
      // display={"flex"}
      // flexDirection={"column"}
    >
      {/* NavBar */}
      <Box
        // flex={"0 0 70px"}
        position={"sticky"}
        top={0}
        zIndex={1000}
        width={"100%"}
        height={"70px"}
        bgcolor={"#1c2533"}
        borderBottom={"1px solid grey"}
        display={"flex"}
        justifyContent={{ xs: "space-between", md: "space-around" }}
        alignItems={"center"}
        p={{ xs: 1.5, md: 2 }}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <IconButton sx={{ backgroundColor: "#28323f", borderRadius: "10px" }}>
            <Gear size={28} weight="regular" />
          </IconButton>
          <Typography variant="h6" fontWeight={"600"} lineHeight={1.3}>
            Admin Dashboard
          </Typography>
        </Stack>
        <Stack
          direction={"row"}
          spacing={1}
          justifyContent={"center"}
          alignItems={"center"}
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
          <Stack display={{ xs: "none", md: "flex" }}>
            <Typography variant="body2" fontWeight={"600"}>
              Crypto Support
            </Typography>
            <Stack direction={"row"} alignItems={"center"} spacing={0.5}>
              <Lock size={16} weight="regular" color="gray" />
              <Typography variant="caption" fontWeight={"500"} color={"gray"}>
                Secured session
              </Typography>
            </Stack>
          </Stack>
        </Stack>
      </Box>

      {/* Main Content */}
      <Box flex={1} bgcolor={"#111827"}>
        <Container maxWidth="lg" sx={{ p: 0 }}>
          <Box display={"flex"} flexDirection={{ xs: "column", md: "row" }}>
            {/* Left Side */}
            <Box
              flex={"0 0 35%"}
              width={"100%"}
              height={"360px"}
              p={2}
              pt={{ xs: 2, md: 3 }}
            >
              <Box
                width={"100%"}
                height={"100%"}
                bgcolor={"#1b2432"}
                border={"1px solid #374151"}
                borderRadius={"15px"}
                p={3}
              >
                <Stack
                  direction={"row"}
                  spacing={1}
                  //   justifyContent={"center"}
                  alignItems={"center"}
                >
                  <Box>
                    <img
                      src={image}
                      alt="profileimage"
                      width={"70px"}
                      height={"70px"}
                      style={{
                        borderRadius: "50%",
                        border: "1px solid grey",
                      }}
                    />
                  </Box>
                  <Stack>
                    <Typography variant="body2" fontWeight={"600"}>
                      Crypto Support
                    </Typography>
                    <Stack
                      direction={"row"}
                      alignItems={"center"}
                      spacing={0.5}
                    >
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
                <Stack direction={"column"} spacing={2} mt={1.5}>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "#262f3c", color: "white" }}
                    onClick={() => navigate("/admin/change-password")}
                  >
                    Change Password
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "#262f3c", color: "white" }}
                    onClick={() => navigate("/admin/2fa-authentication")}
                  >
                    2fa Authentication
                  </Button>
                  <Button
                    variant="contained"
                    fullWidth
                    sx={{ bgcolor: "#262f3c", color: "white" }}
                    onClick={() => dispatch(logout())}
                  >
                    Logout
                  </Button>
                </Stack>

                <Stack
                  direction={"row"}
                  alignItems={"center"}
                  justifyContent={"space-between"}
                  mt={2.5}
                >
                  <Typography variant="body1">Secured Chat</Typography>
                  <IOSSwitch
                    checked={checked}
                    disabled
                    // onChange={changeManualAssetMode}
                    // name="switch1"
                  />
                </Stack>
              </Box>
            </Box>
            {/* Right Side */}
            <Box
              width={"100%"}
              height={"calc(100vh - 80px)"}
              p={2}
              pt={{ xs: 0, md: 3 }}
            >
              <Box
                width={"100%"}
                height={"100%"}
                bgcolor={"#1b2432"}
                border={"1px solid #374151"}
                borderRadius={"15px"}
                p={3}
                overflow={"auto"}
              >
                <Stack
                  direction={"row"}
                  justifyContent={"space-between"}
                  alignItems={"center"}
                >
                  <Stack direction={"row"} alignItems={"center"} spacing={1}>
                    <Typography variant="body1" fontWeight={"bold"}>
                      Pending Conversations
                    </Typography>
                    <Typography
                      variant="body1"
                      bgcolor={"#5398f9"}
                      p={"0px 5px"}
                      borderRadius={"50%"}
                      fontWeight={"bold"}
                    >
                      {unreadCount}
                    </Typography>
                  </Stack>

                  <Stack
                    direction={"row"}
                    alignItems={"center"}
                    spacing={1.5}
                    bgcolor={"#323a46"}
                    borderRadius={"10px"}
                    padding={"2px 10px"}
                  >
                    <StyledBadge
                      overlap="circular"
                      anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
                      variant="dot"
                    />
                    <Typography variant="caption">Live</Typography>
                  </Stack>
                </Stack>

                {isLoading ? (
                  <Stack direction={"column"} spacing={2} mt={2}>
                    {[1, 2].map((i) => (
                      <Skeleton
                        key={i}
                        variant="rectangular"
                        height={"60px"}
                        sx={{ borderRadius: 3 }}
                      />
                    ))}
                  </Stack>
                ) : (
                  allMails &&
                  allMailsBox.length > 0 &&
                  allMailsBox.map((mail) => {
                    // console.log(mail);
                    return (
                      <>
                        <Box
                          bgcolor={"#262f3c"}
                          p={"8px 16px"}
                          mt={2}
                          borderRadius={3}
                        >
                          <Stack
                            direction={"row"}
                            spacing={2}
                            justifyContent={"space-between"}
                            alignItems={"center"}
                          >
                            <Stack
                              direction={"row"}
                              spacing={1}
                              alignItems={"center"}
                            >
                              <img
                                src={image}
                                alt="profileimage"
                                width={"50px"}
                                height={"50px"}
                                style={{
                                  borderRadius: "50%",
                                  border: "1px solid grey",
                                }}
                              />
                              <Stack spacing={0.2}>
                                <Typography variant="body1" fontWeight={"600"}>
                                  {mail?.userId?.firstname +
                                    " " +
                                    mail?.userId?.lastname}
                                </Typography>
                                <Stack
                                  direction={"row"}
                                  alignItems={"center"}
                                  spacing={0.5}
                                >
                                  <Typography
                                    variant="caption"
                                    fontWeight={"500"}
                                    color={"gray"}
                                  >
                                    {shortenText(
                                      mail?.messages?.at(-1)?.content || "",
                                      100,
                                    )}{" "}
                                    {mail?.messages?.at(-1)?.isRead ===
                                      false && mail?.messages?.at(-1)?.from !== "Support Team" && (
                                      <Typography
                                        variant="caption"
                                        color={"springgreen"}
                                        sx={{
                                          bgcolor: "darkgreen",
                                          p: "0px 4px",
                                          borderRadius: "20%",
                                        }}
                                      >
                                        New
                                      </Typography>
                                    )}
                                  </Typography>
                                </Stack>
                              </Stack>
                            </Stack>

                            <Stack direction={"column"} spacing={1.5}>
                              <Button
                                size="small"
                                variant="contained"
                                onClick={() => handleJoin(mail?.userId?._id)}
                                sx={{
                                  fontSize: 12,
                                  px: 0,
                                  bgcolor: "#5398f9",
                                  color: "white",
                                }}
                              >
                                Join
                              </Button>
                              <Button
                                size="small"
                                variant="contained"
                                sx={{
                                  fontSize: 12,
                                  px: 0,
                                  bgcolor: "red",
                                  color: "white",
                                }}
                                // onClick={() => handleDelete(mail?.userId?._id)}

                                onClick={() => {
                                  setSelectedUserID({
                                    userID: user?._id,
                                    userFirstname: user?.firstname,
                                    userLastname: user?.lastname,
                                  });
                                  handleClickDelete();
                                }}
                              >
                                Delete
                              </Button>
                            </Stack>
                          </Stack>
                        </Box>
                      </>
                    );
                  })
                )}
              </Box>
            </Box>
          </Box>
        </Container>
      </Box>

      {/* Delete chat */}
      <Dialog
        open={openDeleteUserDrawer}
        onClose={handleCloseDelete}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {`Delete this user chat and all related data ?`}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Please Note, This action can&apos;t be undone!
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleCloseDelete}
            sx={{ backgroundColor: "grey", color: "white" }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            sx={{ backgroundColor: "darkred", color: "white" }}
            onClick={() => {
              // deleteTrader();
              handleCloseDelete();
            }}
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default AdminChatMessages;
