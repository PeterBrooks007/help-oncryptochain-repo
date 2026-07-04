import React, { useContext, useEffect, useState } from "react";
import {
  Box,
  Button,
  Container,
  IconButton,
  Link,
  Stack,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Headset } from "@phosphor-icons/react";
import { IOSSwitch } from "../dashboard/Profile";
import { motion } from "framer-motion";
import ChatLoginFormComponent from "./ChatLoginFormComponent";
import { ColorModeContext, tokens } from "../../theme";

const MotionBox = motion(Box);

const Chatlogin = () => {
  const theme = useTheme();
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
        height={"80px"}
        bgcolor={"#1c2533"}
        borderBottom={"1px solid grey"}
        display={"flex"}
        justifyContent={"space-around"}
        alignItems={"center"}
        p={2}
      >
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <IconButton sx={{ backgroundColor: "#5398f9", borderRadius: "10px" }}>
            <Headset size={28} weight="regular" />
          </IconButton>
          <Typography variant="h6" fontWeight={"600"} lineHeight={1.3}>
            LiveHelp Support
          </Typography>
        </Stack>
        <Stack direction={"row"} alignItems={"center"} spacing={1}>
          <Typography variant="body1" fontWeight={"400"}>
            Secured Live Chat{" "}
          </Typography>
          <IOSSwitch
            checked={checked}
            // onChange={changeManualAssetMode}
            // name="switch1"
          />
        </Stack>
      </Box>

      {/* Main Content */}
      <Box
        // flex={1}
        bgcolor={"#111827"}
        display={"flex"}
        justifyContent={"center"}
        width={"100%"}
        overflow={"auto"}
        p={{ xs: "30px 15px", lg: 5 }}
      >
        {/* Form Box */}
        <Box
          bgcolor={"#151a22"}
          width={{ xs: "100%", lg: "450px" }}
          borderRadius={4}
          overflow={"hidden"}
          border={"1px solid #30363d"}
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
            px={3}
          >
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <IconButton
                sx={{ backgroundColor: "#203555", borderRadius: "10px" }}
              >
                <Headset size={28} weight="regular" />
              </IconButton>
              <Typography variant="h6" fontWeight={"600"}>
                ChainCare Desk
              </Typography>
            </Stack>
            <Stack direction={"row"} alignItems={"center"} spacing={1}>
              <Typography variant="body1" fontWeight={"500"}>
                Live Chat
              </Typography>
            </Stack>
          </Box>

          {/* Form Box Main Content */}
          <Stack
            display={"flex"}
            direction={"column"}
            spacing={2}
            alignItems={"center"}
            px={3}
            pt={4}
            pb={7}
          >
            <MotionBox
              pt={{ xs: 0, md: 2 }}
              initial={{ y: -5 }}
              animate={{ y: 10 }}
              transition={{
                type: "smooth",
                repeatType: "mirror",
                duration: 2,
                repeat: Infinity,
                delay: 0.8,
              }}
            >
              <IconButton sx={{ backgroundColor: "#203555", p: 2 }}>
                <Headset size={35} weight="bold" color="#3b82f6" />
              </IconButton>
            </MotionBox>

            <Typography textAlign={"center"} fontWeight={"bold"} fontSize={32}>
              Connect with Support
            </Typography>

            <Typography
              variant="subtitle2"
              textAlign={"center"}
              px={{ xs: 0, md: 4 }}
            >
              Start a secure, private chat with our expert support team.
              We&apos;re here to help 24/7.
            </Typography>

            <Stack direction={"row"} spacing={2} py={1.5}>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Headset size={18} weight="regular" color="springgreen" />
                <Typography variant="subtitle1">ChainCare Desk</Typography>
              </Stack>
              <Stack direction={"row"} alignItems={"center"} spacing={1}>
                <Headset size={18} weight="regular" color={"skyblue"} />

                <Typography variant="subtitle1" fontWeight={"500"}>
                  Live Chat
                </Typography>
              </Stack>
            </Stack>

            {/* Form Box Component */}
            <Box width={"100%"}>
              <ChatLoginFormComponent />
            </Box>
          </Stack>

          {/* Footer */}
          <Box
            width={"100%"}
            height={"100px"}
            bgcolor={"#1c2533"}
            borderTop={"1px solid #30363d"}
            display={"flex"}
            alignItems={"center"}
            px={3}
          >
            <Stack direction={"row"}>
              {/* <Headset size={25} weight="regular" color={"skyblue"} /> */}

              <Typography variant="subtitle1" textAlign={"center"} ml={0.5}>
                © 2026 ChainCare Desk. All rights reserved. All rights
                reserved.All rights reserved.
              </Typography>
            </Stack>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default Chatlogin;
