import LarpAPI from "../util/api";
import { useNavigate } from "react-router-dom";

import TooltipButton from "../components/FormComponents/TooltipButton";
import {
  faImage,
  faPencil,
  faStar,
  faTrash,
} from "@fortawesome/free-solid-svg-icons";
import { Larp } from "../types";

function useLarpControls(larp: Larp) {
  const larpId = larp.id;

  const navigate = useNavigate();

  function deleteLarp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    LarpAPI.DeleteLarp(larpId);
    navigate("/events");
  }

  function editLarp(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/events/${larpId}/edit`);
  }

  function editImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/events/${larpId}/image`);
  }

  function toggleFeatured(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    LarpAPI.UpdateLarp({
      ...larp,
      isFeatured: !larp.isFeatured,
    });
  }

  // const DeleteLarpButton = <DeleteLarpButtonComponent handleDelete={deleteLarp} />;
  // const EditLarpButton = <EditLarpButtonComponent handleClick={editLarp} />;
  const DeleteLarpButton = (
    <TooltipButton
      onClick={deleteLarp}
      tooltip="Delete this Event"
      icon={faTrash}
    />
  );
  const EditLarpButton = (
    <TooltipButton
      onClick={editLarp}
      tooltip="Edit this Event"
      icon={faPencil}
    />
  );
  const EditImageButton = (
    <TooltipButton
      onClick={editImage}
      tooltip="Update Banner Image"
      icon={faImage}
    />
  );
  const ToggleFeaturedButton = (
    <TooltipButton
      onClick={toggleFeatured}
      tooltip="Toggle Featured Event"
      icon={faStar}
    />
  );

  return {
    DeleteLarpButton,
    EditLarpButton,
    EditImageButton,
    ToggleFeaturedButton,
  };
}

export default useLarpControls;
