import './LarpCard.scss';
import { Larp } from '../../types';

import { Link as RouterLink } from 'react-router-dom';

import { useTheme } from '@mui/material/styles';
import { Box, Stack, Typography, Link } from '@mui/material';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faLocationDot,
  faComment,
  faGlobe,
} from '@fortawesome/free-solid-svg-icons';

import TagCard from './TagDisplay';
import { JSDateToLuxon } from '../../util/typeConverters';
import useLarpControls from '../../hooks/useLarpControls';
import { userContext } from '../../context/userContext';
import { useContext } from 'react';

type LarpCardProps = {
  larp: Larp;
};

export default function LarpCard({ larp }: LarpCardProps) {
  const theme = useTheme();
  const { user } = useContext(userContext);
  const { username, isAdmin } = user;
  const { EditLarpButton, DeleteLarpButton, EditImageButton } =
    useLarpControls(larp);

  let ticketColor = theme.palette.success.main;
  if (larp.ticketStatus === 'LIMITED') ticketColor = theme.palette.warning.main;
  if (larp.ticketStatus === 'SOLD_OUT') ticketColor = theme.palette.error.main;

  return (
    <Stack
      className="LarpCard"
      direction="column"
      sx={{
        width: '300px',
      }}
    >
      <Link
        component={RouterLink}
        to={`/events/${larp.id}`}
        sx={{ textDecoration: 'none', color: 'inherit' }}
      >
        <Box
          className="LarpCard-header"
          sx={{
            backgroundImage: `url(${larp.imgUrl.sm})`,
            backgroundPosition: 'center',
            backgroundSize: 'cover',
          }}
        ></Box>
      </Link>
      {larp.organization.username === username || isAdmin === true ? (
        <Stack
          direction="row"
          className="larpControls"
          justifyContent="space-around"
        >
          {EditLarpButton}
          {EditImageButton}
          {DeleteLarpButton}
        </Stack>
      ) : (
        <></>
      )}

      <Stack
        className="LarpCard-content"
        direction="column"
        spacing={0.5}
        flexBasis={1}
      >
        <Typography color={ticketColor} variant={'details2'}>
          Tickets: {larp.ticketStatus}
        </Typography>
        <Link
          component={RouterLink}
          to={`/events/${larp.id}`}
          sx={{ textDecoration: 'none', color: 'inherit' }}
        >
          <Typography
            variant="h4"
            component="h4"
            className="title"
            sx={{
              display: '-webkit-box',
              overflow: 'hidden',
              WebkitBoxOrient: 'vertical',
              WebkitLineClamp: 2,
            }}
          >
            {larp.title}
          </Typography>
        </Link>

        <Typography className=".dates" variant={'details1'}>
          {`${JSDateToLuxon(larp.start).toLocaleString({ weekday: 'short', month: 'short', day: 'numeric' })}
                         - ${JSDateToLuxon(larp.end).toLocaleString({ weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}`}
        </Typography>

        <Box className="LarpCard-details">
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="icon-text"
          >
            <FontAwesomeIcon icon={faLocationDot} />
            <Typography variant="details2">
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
            <Typography variant="details2">{larp.language}</Typography>
          </Stack>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1}
            className="icon-text"
          >
            <FontAwesomeIcon icon={faGlobe} />
            <Typography variant="details2">
              {larp.organization.orgName}
            </Typography>
          </Stack>
        </Box>

        <Stack direction="row" flexWrap="wrap" spacing={1} margin="auto">
          {larp.tags.slice(0, 4).map((tag) => (
            <TagCard key={tag.name} tag={tag} />
          ))}
        </Stack>
      </Stack>
    </Stack>
  );
}
