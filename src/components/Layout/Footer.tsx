import React from "react";
import { Box } from "@mui/material";
import { FOOT_NAV_HEIGHT } from "./Layout";
import EmailIcon from "@mui/icons-material/Email";
import GitHubIcon from "@mui/icons-material/GitHub";
import TwitterIcon from "@mui/icons-material/Twitter";
import FacebookIcon from "@mui/icons-material/Facebook";
import InstagramIcon from "@mui/icons-material/Instagram";

export const Footer: React.FC = () => {
  return (
    <Box
      gap={1}
      sx={{
        height: FOOT_NAV_HEIGHT,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        "& :hover": {
          color: "cyan",
        },
      }}
    >
      <InstagramIcon />
      <FacebookIcon />
      <GitHubIcon />
      <TwitterIcon />
      <EmailIcon />
    </Box>
  );
};
