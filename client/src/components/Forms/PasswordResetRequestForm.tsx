import { useState } from "react";

import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { TextField } from "@mui/material";
import LarpAPI from "../../util/api";
// import "./userRegistrationForm.scss";

type PasswordResetRequestData = {
  username: string;
};

const DEFAULT_FORM_DATA: PasswordResetRequestData = {
  username: "",
};

type props = {
  handleClose: () => void;
};

function PasswordResetRequestForm({ handleClose }: props) {
  const [formData, setFormData] =
    useState<PasswordResetRequestData>(DEFAULT_FORM_DATA);
  const [error, setError] = useState<string | null>(null);
  const [submitted, setSubmitted] = useState<boolean>(false);

  function handleChange(evt: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = evt.target;
    setFormData((currentFormData) => {
      return {
        ...currentFormData,
        [name]: value,
      };
    });
  }

  async function handleSubmit(
    e: React.MouseEvent<HTMLButtonElement, MouseEvent>,
  ) {
    e.preventDefault();
    try {
      //send request
      await LarpAPI.createPasswordResetRequest(formData);
      setSubmitted(true);
    } catch (err) {
      setError("Invalid username/password");
    }
  }

  return submitted ? (
    <Stack spacing={2}>
      <Typography>
        An email has been sent to the address associated with your account
      </Typography>
      <Stack direction="row" justifyContent={"end"} spacing={3}>
        <Button
          variant="outlined"
          type="submit"
          onClick={() => {
            setSubmitted(false);
          }}
        >
          Back
        </Button>
        <Button variant="contained" type="submit" onClick={handleClose}>
          Okay
        </Button>
      </Stack>
    </Stack>
  ) : (
    <Stack spacing={2} component="form">
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
        <TextField
          sx={{ flexGrow: 1 }}
          variant="outlined"
          name="username"
          label="Username"
          onChange={handleChange}
        />
      </Stack>
      {error ? (
        <Typography variant="subtitle1" color="primary">
          {error}
        </Typography>
      ) : (
        <></>
      )}

      <Stack direction="row" justifyContent={"end"} spacing={3}>
        <Button
          variant="outlined"
          onClick={() => {
            handleClose();
          }}
        >
          Cancel
        </Button>
        <Button
          variant="contained"
          type="submit"
          onClick={(e) => {
            handleSubmit(e);
          }}
        >
          Next
        </Button>
      </Stack>
    </Stack>
  );
}

export default PasswordResetRequestForm;
