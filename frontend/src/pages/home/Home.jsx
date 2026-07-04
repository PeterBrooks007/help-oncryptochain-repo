import { useMediaQuery, useTheme } from "@mui/material";

import Homedesktop from "./HomeDesktop";
import HomeMobile from "./HomeMobile";
import Chatlogin from "./Chatlogin";

const Home = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  // return <>{isMobile ? <HomeMobile /> : <Homedesktop />}</>;
  return <><Chatlogin /></>;
};

export default Home;
