import sharp from "sharp";
import { uploadMultiple } from "../api/s3";

type ResizedImages = {
  sm: Buffer;
  md: Buffer;
  lg: Buffer;
};

const RESOLUTION_SM = [350, 150];
const RESOLUTION_MD = [817, 350];
const RESOLUTION_LG = [1280, 550];

class ImageHandler {
  /** Accepts an image buffer and a string basePath
   * Uploads multiple sizes of that image to S3 at the
   * given path (basePath-sm, basePath-md, basePath-lg)
   */
  static async uploadAllSizes(
    image: Buffer,
    basePath: string,
    timestamp: string,
  ) {
    const resizedImages: ResizedImages = await this.getResized(image);
    const uploadParams = Object.keys(resizedImages).map(
      (key: "sm" | "md" | "lg") => ({
        buffer: resizedImages[key],
        path: `${basePath}-${key}-${timestamp}`,
      }),
    );
    await uploadMultiple(uploadParams);
  }

  /** Accepts an image buffer.  Converts that image to jpeg format and resizes it
   * into small, medium and large versions of the same image.
   */
  static async getResized(image: Buffer): Promise<ResizedImages> {
    const sm = await sharp(image)
      .resize(...RESOLUTION_SM)
      .jpeg({ quality: 50 })
      .toBuffer();
    const md = await sharp(image)
      .resize(...RESOLUTION_MD)
      .jpeg({ quality: 50 })
      .toBuffer();
    const lg = await sharp(image)
      .resize(...RESOLUTION_LG)
      .jpeg({ quality: 50 })
      .toBuffer();

    return { sm, md, lg };
  }
}

export default ImageHandler;
