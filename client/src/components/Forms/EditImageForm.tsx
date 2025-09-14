import { Larp, Organization } from "../../types";
import { Box, Button, Stack, Typography } from "@mui/material";
import { useState } from "react";

type ImageFormProps<T> = {
  submitCallback: (image: Blob, id: number) => Promise<void>;
  model: T;
};

function ImageForm<T extends Organization | Larp>({
  submitCallback,
  model,
}: ImageFormProps<T>) {
  const [image, setImage] = useState<Blob | null>(null);
  const [fileName, setFileName] = useState("No File Selected");

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    e.preventDefault();
    const file = e.target.files![0];
    setFileName(e.target.files![0].name);
    setImage(file);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    e.stopPropagation();
    if (!image) {
      console.error("Please select a file to upload");
    } else {
      await submitCallback(image, model.id);
    }
  }

  return (
    <>
      {model && (
        <Box
          className="banner"
          sx={{
            width: "80%",
            aspectRatio: "7/3",
            backgroundImage: image
              ? `url(${URL.createObjectURL(image)})`
              : `url(${model.imgUrl.lg})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            display: "relative",
            borderRadius: "1rem",
          }}
        ></Box>
      )}
      <form onSubmit={async (e) => handleSubmit(e)} className="ImageForm">
        <Stack justifyContent="center" alignItems="center" spacing={1}>
          <Stack
            direction="row"
            alignItems="center"
            justifyContent="space-evenly"
            spacing={2}
          >
            <Button
              className="ImageForm-uploadButton"
              variant="contained"
              component="label"
            >
              Choose File
              <input
                type="file"
                accept="image"
                name="image"
                hidden
                onChange={(e) => handleChange(e)}
              />
            </Button>
            <Box className="ImageForm-fileName">
              <Typography>{fileName}</Typography>
            </Box>
          </Stack>
          <Button
            type="submit"
            className="ImageForm-uploadButton"
            disabled={!image}
          >
            Submit
          </Button>
        </Stack>
      </form>
    </>
  );
}

export default ImageForm;
