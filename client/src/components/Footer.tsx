import { Box, Typography } from "@mui/material";
import { Link } from "react-router-dom";
import "./Footer.scss";

function Footer() {
  return (
    <Box component="section" className="Footer">
      <Typography component="p" variant="caption" className="copyright">
        ©LarpCal 2024. The calendar was funded by Jacob Møller jensen and
        developed by{" "}
        <Link to="https://stufleisher.com" target="new">
          Stuart Fleisher
        </Link>
        .
      </Typography>
    </Box>
  );
}

export default Footer;
