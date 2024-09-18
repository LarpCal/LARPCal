import { Larp } from "../../types";
import TagCard from "./TagDisplay";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLocationDot, faComment, faUser, faGlobe, faEnvelope } from "@fortawesome/free-solid-svg-icons";

import { Typography, Stack, Box, Link } from "@mui/material";
import { JSDateToLuxon } from "../../util/typeConverters";

import "./LarpDetails.scss";
import { useContext } from "react";
import { userContext } from "../../context/userContext";
import useLarpControls from "../../hooks/useLarpControls";

import { Link as RouterLink } from "react-router-dom";



type LarpDetailsProps = {
    larp: Larp,
};

function LarpDetails({ larp }: LarpDetailsProps) {
    const { username, isAdmin } = useContext(userContext);
    const { EditLarpButton, DeleteLarpButton, EditImageButton } = useLarpControls(larp);

    return (
        <Box className="LarpDetails">
            <Box
                className="banner"
                sx={{
                    backgroundImage: `url(${larp.imgUrl.lg})`,
                    backgroundSize: 'cover',
                }}
            >
                {
                    (larp.organization.username === username) || isAdmin === true
                        ?
                        <Stack
                        direction="row"
                        className="larpControls"
                        justifyContent="space-around"
                        >
                            {EditLarpButton}
                            {EditImageButton}
                            {DeleteLarpButton}
                        </Stack>
                        :
                        <></>

                }
            </Box>

            <Stack
                className="LarpDetails-content"
                direction="column"
                spacing={2}
                alignContent="center"
            >
                <Typography variant='h4' className="filled-secondary">
                    {
                        JSDateToLuxon(larp.start).toLocaleString({
                            weekday: 'short',
                            month: 'long',
                            day: 'numeric',
                        })
                    } - {
                        JSDateToLuxon(larp.end).toLocaleString({
                            weekday: 'short',
                            month: 'long',
                            day: 'numeric',
                        })
                    }
                </Typography>
                <Typography component="h1" variant='h1' className="title">
                    <Link component={RouterLink} to={`/events/${larp.id}`}>
                        {larp.title}
                    </Link>
                </Typography>

                <Stack direction="row" spacing={1}>
                    {larp.tags.map((tag) => (
                        <TagCard key={tag.name} tag={tag} fontSize={14} />
                    ))}
                </Stack>

                <Box className="filled-light">
                    <Typography>
                        Hosted By: <Link component={RouterLink} to={`/orgs/${larp.organization.id}`}>
                            {larp.organization.orgName}
                        </Link>
                    </Typography>
                    <Typography
                        // color={ticketColor}
                        variant={'details2'}
                    >
                        Tickets: {larp.ticketStatus}
                    </Typography>
                </Box>

                <section id="About">
                    <Typography component="h3" variant='h2' className="Date & Time">
                        About this event:
                    </Typography>
                    <Typography>{larp.description}</Typography>
                </section>


                <section id="Location">
                    <Typography component="h3" variant='h2' className="Date & Time">
                        Location:
                    </Typography>
                    <Box>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            className="icon-text"
                        >
                            <FontAwesomeIcon icon={faLocationDot} />
                            <Typography >
                                {larp.city}, {larp.country}
                            </Typography>
                        </Stack>
                        <Stack
                            direction="row"
                            alignItems="center"
                            spacing={1}
                            className="icon-text"
                        >
                            <FontAwesomeIcon icon={faComment} />
                            <Typography>
                                {larp.language}
                            </Typography>
                        </Stack>
                    </Box>
                </section>

                <section id="DateAndTime">
                    <Typography component="h3" variant='h2' className="Date & Time">
                        Date & Time:
                    </Typography>
                    <Typography>
                        <Box component='span' sx={{ fontWeight: 900 }}>Starts: </Box>
                        {JSDateToLuxon(larp.start).toLocaleString({
                            weekday: 'short',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })}
                    </Typography>
                    <Typography>
                        <Box component='span' sx={{ fontWeight: 900 }}>Ends: </Box>
                        {JSDateToLuxon(larp.start).toLocaleString({
                            weekday: 'short',
                            month: 'long',
                            day: 'numeric',
                            hour: 'numeric',
                            minute: 'numeric',
                        })}
                    </Typography>
                </section>

                <section id="Organizer">
                    <Typography component="h3" variant='h2' className="organizer">
                        About the organizer:
                    </Typography>
                    <Box
                        className="filled-light"
                        sx={{
                            padding:'1rem 2rem',
                            width: "100%"
                        }}
                    >
                        <Stack
                            direction="row"
                            // spacing={3}
                            alignItems="center"
                            flexWrap='wrap'
                        >
                            <Box
                                sx={{
                                    backgroundImage: `url(${larp.organization.imgUrl.lg})`,
                                    backgroundPosition: 'center',
                                    backgroundSize: 'cover',
                                    backgroundRepeat: "no-repeat",
                                    borderRadius: '5px',
                                    overflow: 'auto',
                                    width: {xs:"100%", sm:'200px'},
                                    height: '200px',

                                }}
                            />
                            <Box sx={{
                                padding:{
                                    xs: '1rem 0',
                                    sm:'2rem'
                                }
                            }}>
                                <Typography variant="h4" component="h6"
                                    sx={{
                                        marginBottom:'.5rem'
                                    }}
                                >{larp.organization.orgName}</Typography>
                                <Typography>
                                    <FontAwesomeIcon icon={faUser} />
                                    &nbsp;  &nbsp;
                                    <Link component={RouterLink} to={`/orgs/${larp.organization.id}`}>
                                        View Profile
                                    </Link>
                                </Typography>
                                <Typography>
                                    <FontAwesomeIcon icon={faGlobe} />
                                    &nbsp;  &nbsp;
                                    <Link component={RouterLink} to={`${larp.organization.orgUrl}`}>
                                        {larp.organization.orgUrl}
                                    </Link>
                                </Typography>
                                <Typography>
                                    <FontAwesomeIcon icon={faEnvelope} />
                                    &nbsp;  &nbsp;
                                    <Link component={RouterLink} to={`mailto:${larp.organization.email}`}>
                                        {larp.organization.email}
                                    </Link>
                                </Typography>
                            </Box>
                        </Stack>
                        <Typography
                            sx={{
                                paddingTop: "1rem",
                            }}
                        >
                            {larp.organization.description}
                        </Typography>
                    </Box>
                </section>
            </Stack>
        </Box >
    );
}

export default LarpDetails;