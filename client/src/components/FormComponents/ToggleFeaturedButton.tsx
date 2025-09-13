import { Tooltip, IconButton } from '@mui/material';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';
import { faStar as faStarOutline } from '@fortawesome/free-regular-svg-icons';

type ToggleFeaturedButtonProps = {
  handleClick: (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
  isFeatured: boolean;
};

function ToggleFeaturedButton({
  handleClick,
  isFeatured,
}: ToggleFeaturedButtonProps) {
  return (
    <Tooltip title="Toggle Featured">
      <IconButton onClick={handleClick}>
        <FontAwesomeIcon icon={isFeatured ? faStar : faStarOutline} />
      </IconButton>
    </Tooltip>
  );
}

export default ToggleFeaturedButton;
