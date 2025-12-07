import { Box, Typography } from "@mui/material";
import "./Footer.scss";
import { TextLink } from "./ui/TextLink";

function Footer() {
  return (
    <Box component="section" className="Footer">
      <Typography component="p" variant="caption" className="copyright">
        ©LarpCal 2024. The calendar was funded by Jacob Møller jensen and
        developed by{" "}
        <TextLink to="https://stufleisher.com">Stuart Fleisher</TextLink> and{" "}
        <TextLink to="https://echonyc.blog">Echo</TextLink>.
      </Typography>
    </Box>
  );
}

export default Footer;
