import LarpAPI from "../util/api";
import { useNavigate } from "react-router-dom";

import TooltipButton from "../components/FormComponents/TooltipButton";
import { faImage, faPencil, faTrash } from "@fortawesome/free-solid-svg-icons";

function useOrgControls(orgId: number) {
  const navigate = useNavigate();

  function deleteOrg(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    LarpAPI.DeleteOrg(orgId);
    navigate("/");
  }

  function editOrg(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/orgs/${orgId}/edit`);
  }

  function editImage(e: React.MouseEvent<HTMLButtonElement, MouseEvent>) {
    e.stopPropagation();
    e.preventDefault();
    navigate(`/orgs/${orgId}/image`);
  }

  const DeleteOrgButton = (
    <TooltipButton
      handleClick={deleteOrg}
      title="Delete this LARP"
      icon={faTrash}
    />
  );
  const EditOrgButton = (
    <TooltipButton
      handleClick={editOrg}
      title="Edit this LARP"
      icon={faPencil}
    />
  );
  const EditImageButton = (
    <TooltipButton
      handleClick={editImage}
      title="Update Banner Image"
      icon={faImage}
    />
  );

  return { DeleteOrgButton, EditOrgButton, EditImageButton };
}

export default useOrgControls;
