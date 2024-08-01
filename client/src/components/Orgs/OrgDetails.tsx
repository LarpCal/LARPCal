import { Organization } from "../../types";
import { Typography, Stack, Box, Link } from "@mui/material";
import { Link as RouterLink } from "react-router-dom";
import CategoryBar from "../Events/CategoryBar";
import "./OrgDetails.scss";
import useOrgControls from "../../hooks/useOrgControls";
import { useContext } from "react";
import { userContext } from "../../context/userContext";

type OrgDetailsProps = {
    org: Organization;
};

function OrgDetails({ org }: OrgDetailsProps) {
    const { username, isAdmin } = useContext(userContext);
    const { EditOrgButton } = useOrgControls(org.id);

    return (
        <Box className="OrgDetails">
            <Box
                className="banner"
                sx={{
                    backgroundImage: `url(${org.imgUrl.lg})`,
                    backgroundSize: 'cover',
                }}
            >
                {
                    (org.username === username) || isAdmin === true
                        ?
                        <Stack direction="row" className="organizerControls">
                            {EditOrgButton}
                        </Stack>
                        :
                        <></>
                }
            </Box>
            <Stack
                className="OrgDetails-content"
                direction="column"
                spacing={2}
                alignContent="center"
            >
                <Typography component="h1" variant='h1' className="title">
                    <Link component={RouterLink} to={`/orgs/${org.id}`}>
                        {org.orgName}
                    </Link>
                </Typography>

                <section id="About">
                    <Typography component="h3" variant='h2' className="Date & Time">
                        About this Organizer:
                    </Typography>
                    <Typography>
                        <Link component={RouterLink} to={org.orgUrl}>{org.orgUrl}</Link>
                    </Typography>
                    <Typography>{org.description}</Typography>
                </section>

                <CategoryBar title={`${org.orgName}'s Upcoming Events`} />
                <CategoryBar title={`${org.orgName}'s Past Events`} />
            </Stack>

        </Box>
    );

}

export default OrgDetails;