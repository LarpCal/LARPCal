/** Handles interactions with AmazonS3 */

import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
} from "@aws-sdk/client-s3";
import { mockDeep } from "jest-mock-extended";

const BUCKET_NAME = process.env.BUCKET_NAME;
const BUCKET_REGION = process.env.BUCKET_REGION;
const AWS_KEY = process.env.AWS_KEY;
const AWS_SECRET_KEY = process.env.AWS_SECRET_KEY;

let s3: null | S3Client = null;

/** Creates an S3Client instance for future requests
 * Returns either an s3 instance or a mock of an s3 instance for testing */
function getS3(): S3Client {
  if (s3 === null) {
    if (process.env.NODE_ENV === "test") {
      console.log("Loading mock s3 for testing");
      let mockS3 = mockDeep() as unknown as S3Client;
      s3 = mockS3;
    } else {
      s3 = new S3Client({
        credentials: {
          accessKeyId: AWS_KEY as string,
          secretAccessKey: AWS_SECRET_KEY as string,
        },
        region: BUCKET_REGION,
      });
    }
  }
  return s3;
}

/** Accepts an image buffer and the path for storage on s3.
 * Saves the file to the indicated path in the parsley s3 bucket.
 *
 * Returns the response from the s3 server.
 */
async function uploadFile(imageBuffer: Buffer, path: string) {
  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
    Body: imageBuffer,
    ContentType: "image/jpeg",
  };

  const command = new PutObjectCommand(params);
  const response = await getS3().send(command);
  return response;
}

/** Accepts an array of objects representing uploadFile params
 * [{imageBuffer:Buffer, path:string},...]
 * Attempts to store each file in it's corresponding s3 path.  All uploads
 * succeed or fail together.
 *
 * Returns the response from the s3 server.
 */
async function uploadMultiple(images: { buffer: Buffer; path: string }[]) {
  let uploadedPaths: string[] = [];

  try {
    let uploadPromises = images.map((image) =>
      uploadFile(image.buffer, image.path).then(() =>
        uploadedPaths.push(image.path),
      ),
    );
    await Promise.all(uploadPromises);
  } catch (err) {
    await deleteMultiple(uploadedPaths);
    throw err;
  }
}

/** Accepts a path to a file on the s3 server and removes that file.
 *
 * Returns the response from the s3 server.
 */
async function deleteFile(path: string) {
  console.log(path);

  const params = {
    Bucket: BUCKET_NAME,
    Key: path,
  };

  const command = new DeleteObjectCommand(params);
  const response = await getS3().send(command);
  return response;
}

/** Accepts an array of paths and removes the files at those paths from s3.
 *
 * Returns the responses from the s3 server.
 */
async function deleteMultiple(paths: string[]) {
  const deletePromises = paths.map((path) => deleteFile(path));
  let deleteResponses = await Promise.all(deletePromises);
  console.log(deleteResponses);
  return deleteResponses;
}

export { uploadFile, deleteFile, uploadMultiple, deleteMultiple };
