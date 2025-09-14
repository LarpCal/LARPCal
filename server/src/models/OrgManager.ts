import { prisma } from "../prismaSingleton";
import {
  OrganizationForCreate,
  Organization,
  OrganizationForUpdate,
} from "../types";
import { BadRequestError, NotFoundError } from "../utils/expressError";
import ImageHandler from "../utils/imageHandler";
import { Larp } from "../types";
import { deleteMultiple } from "../api/s3";

const ORG_INCLUDE_OBJ = {
  imgUrl: true,
  larps: {
    include: {
      tags: true,
      imgUrl: true,
    },
  },
};

const BUCKET_NAME = process.env.BUCKET_NAME;
const DEFAULT_IMG_URL = `https://${BUCKET_NAME}.s3.amazonaws.com/orgImage/default`;
class OrgManager {
  static async createOrg(
    orgData: OrganizationForCreate,
  ): Promise<Organization> {
    const { username, ...data } = orgData;

    const org: Organization = await prisma.organization.create({
      data: {
        ...data,
        isApproved: false,
        user: {
          connect: { username: username },
        },
        imgUrl: {
          create: {
            sm: `${DEFAULT_IMG_URL}-sm`,
            md: `${DEFAULT_IMG_URL}-md`,
            lg: `${DEFAULT_IMG_URL}-lg`,
          },
        },
      },
      include: ORG_INCLUDE_OBJ,
    });

    return org;
  }

  static async getAllOrgs(): Promise<Organization[]> {
    return await prisma.organization.findMany({
      orderBy: { id: "asc" },
      include: ORG_INCLUDE_OBJ,
    });
  }

  static async getOrgById(id: number): Promise<Organization> {
    try {
      const org = await prisma.organization.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: ORG_INCLUDE_OBJ,
      });
      return org;
    } catch (err) {
      //use our custom error instead
      throw new NotFoundError("Record not found");
    }
  }

  static async getOrgByOrgName(orgName: string): Promise<Organization> {
    try {
      const org = await prisma.organization.findUniqueOrThrow({
        where: {
          orgName: orgName,
        },
        include: ORG_INCLUDE_OBJ,
      });
      return org;
    } catch (err) {
      //use our custom error instead
      throw new NotFoundError("Record not found");
    }
  }

  static async getOrgByOwner(username: string): Promise<Organization> {
    try {
      const org = await prisma.organization.findUniqueOrThrow({
        where: {
          username: username,
        },
        include: ORG_INCLUDE_OBJ,
      });
      return org;
    } catch (err) {
      //use our custom error instead
      throw new NotFoundError("Record not found");
    }
  }

  static async updateOrg(newOrg: OrganizationForUpdate): Promise<Organization> {
    console.log(newOrg.username);
    const currentOrg: Organization =
      await prisma.organization.findUniqueOrThrow({
        where: { id: newOrg.id },
        include: ORG_INCLUDE_OBJ,
      });

    const org: Organization = await prisma.organization.update({
      where: { id: newOrg.id },
      data: {
        orgName: newOrg.orgName || currentOrg.orgName,
        orgUrl: newOrg.orgUrl || currentOrg.orgUrl,
        description: newOrg.description || currentOrg.description,
        email: newOrg.email || currentOrg.email,
        imgUrl: {
          update: {
            data: {
              sm: newOrg.imgUrl?.sm || currentOrg.imgUrl.sm,
              md: newOrg.imgUrl?.md || currentOrg.imgUrl.md,
              lg: newOrg.imgUrl?.lg || currentOrg.imgUrl.lg,
            },
            where: { id: newOrg.imgSetId },
          },
        },
      },
      include: ORG_INCLUDE_OBJ,
    });

    return org;
  }

  static async setApproved(
    id: number,
    isApproved: boolean,
  ): Promise<Organization> {
    const org: Organization = await prisma.organization.update({
      where: { id },
      data: {
        isApproved,
        larps: {
          //automatically publish/unpublish events for this user
          updateMany: {
            where: {},
            data: { isPublished: isApproved },
          },
        },
      },
      include: ORG_INCLUDE_OBJ,
    });
    return org;
  }

  static async deleteOrgById(id: number): Promise<Organization> {
    // try { await this.deleteRecipeImage(id); }
    //   catch(err) {
    //   console.warn(`Image for recipeId ${id} could not be deleted`);
    // }

    try {
      const deletedLarps = await prisma.larp.deleteMany({
        where: { orgId: id },
      });

      const org = await prisma.organization.delete({
        where: {
          id: id,
        },
        include: ORG_INCLUDE_OBJ,
      });
      return org;
    } catch (err) {
      //use our custom error instead
      console.log(err);
      throw new NotFoundError("Record not found");
    }
  }

  /**************************** IMAGES ***************************************/

  /**Uploads a file to s3 and stores the resulting uri in the imageUrl property
   *
   * @param file: the file to upload
   * @param id: the id for the record to update
   *
   * @returns the updated org
   */
  static async updateOrgImage(file: Express.Multer.File, id: number) {
    const org = await OrgManager.getOrgById(+id);
    const s3Path = `orgImage/org-${id}`;
    const basePath = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Path}`;
    const uuid = crypto.randomUUID();

    try {
      await ImageHandler.uploadAllSizes(file.buffer, s3Path, uuid);
      if (
        org.imgUrl.sm !==
        `https://${BUCKET_NAME}.s3.amazonaws.com/orgImage/default-sm`
      ) {
        await deleteMultiple([
          org.imgUrl.sm.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, ""),
          org.imgUrl.md.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, ""),
          org.imgUrl.lg.replace(`https://${BUCKET_NAME}.s3.amazonaws.com/`, ""),
        ]);
      }
    } catch (e) {
      throw new BadRequestError(
        `There was a problem updating this image: ${e}`,
      );
    }

    org.imgUrl = {
      sm: `${basePath}-sm-${uuid}`,
      md: `${basePath}-md-${uuid}`,
      lg: `${basePath}-lg-${uuid}`,
    };
    return await OrgManager.updateOrg(org);
  }

  //end class
}

export default OrgManager;
