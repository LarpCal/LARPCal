import { prisma } from '../prismaSingleton';
import { LarpForCreate, Larp, LarpForUpdate, LarpQuery } from '../types';
import { BadRequestError, NotFoundError } from '../utils/expressError';
import { Tag } from '../types';
import ImageHandler from '../utils/imageHandler';
import { Prisma, TicketStatus } from '@prisma/client';
import { deleteMultiple } from '../api/s3';

const LARP_INCLUDE_OBJ = {
  tags: true,
  imgUrl: true,
  organization: { include: { imgUrl: true } },
};

const BUCKET_NAME = process.env.BUCKET_NAME;
const DEFAULT_IMG_URL = `https://${BUCKET_NAME}.s3.amazonaws.com/larpImage/default`;

class LarpManager {
  static async createLarp(larpData: LarpForCreate): Promise<Larp> {
    const { tags, orgId, ...data } = larpData;

    const larp: Larp = await prisma.larp.create({
      data: {
        ...data,
        organization: {
          connect: { id: orgId },
        },
        imgUrl: {
          create: {
            sm: `${DEFAULT_IMG_URL}-sm`,
            md: `${DEFAULT_IMG_URL}-md`,
            lg: `${DEFAULT_IMG_URL}-lg`,
          },
        },
        tags: {
          connectOrCreate: tags.map((tag: Tag) => ({
            where: { name: tag.name },
            create: { name: tag.name },
          })),
        },
      },
      include: LARP_INCLUDE_OBJ,
    });

    return larp;
  }

  static async publishLarp(id: number): Promise<Larp> {
    const larp: Larp = await prisma.larp.update({
      where: { id },
      data: { isPublished: true },
      include: LARP_INCLUDE_OBJ,
    });

    return larp;
  }

  static async getAllLarps(query?: LarpQuery): Promise<Larp[]> {
    let larps: Larp[];
    let isPublished =
      query?.isPublished !== undefined ? query.isPublished : true;

    if (!query) {
      //No query provided
      larps = await prisma.larp.findMany({
        orderBy: { start: 'asc' },
        include: LARP_INCLUDE_OBJ,
      });
    } else if (query && !query.term) {
      // Query contains filters but no search term

      let prismaFilterObject: Prisma.LarpWhereInput = {
        AND: {
          title: {
            contains: query.title,
            mode: 'insensitive',
          },
          ticketStatus: {
            equals: query.ticketStatus
              ? TicketStatus[query.ticketStatus]
              : undefined,
          },
          start: {
            gte: query.startAfter ? new Date(query.startAfter) : undefined,
            lte: query.startBefore ? new Date(query.startBefore) : undefined,
          },
          end: {
            gte: query.endAfter ? new Date(query.endAfter) : undefined,
            lte: query.endBefore ? new Date(query.endBefore) : undefined,
          },
          createdTime: {
            gte: query.createdAfter ? new Date(query.createdAfter) : undefined,
            lte: query.createdBefore
              ? new Date(query.createdBefore)
              : undefined,
          },
          city: {
            contains: query.city,
            mode: 'insensitive',
          },
          country: {
            contains: query.country,
            mode: 'insensitive',
          },
          language: {
            contains: query.language,
            mode: 'insensitive',
          },
          organization: {
            orgName: {
              contains: query.org,
              mode: 'insensitive',
            },
          },
          isFeatured: {
            equals: query.isFeatured,
          },
          isPublished: {
            equals: isPublished,
          },
          tags: query.tags
            ? {
                some: {
                  name: {
                    contains: query.tags,
                    mode: 'insensitive',
                  },
                },
              }
            : undefined,
        },
      };

      larps = await prisma.larp.findMany({
        where: prismaFilterObject,
        include: LARP_INCLUDE_OBJ,
        orderBy: { start: 'asc' },
      });
    } else {
      // Query contains search term and filters
      let prismaFilterObject: Prisma.LarpWhereInput = {
        AND: {
          OR: [
            { title: { search: query.term } },
            { description: { search: query.term } },
            { city: { search: query.term } },
            { country: { search: query.term } },
            { language: { search: query.term } },
            { tags: { some: { name: { contains: query.term } } } },
            { organization: { orgName: { contains: query.term } } },
          ],
          title: {
            contains: query.title,
            mode: 'insensitive',
          },
          ticketStatus: {
            equals: query.ticketStatus
              ? TicketStatus[query.ticketStatus]
              : undefined,
          },
          start: {
            gte: query.startAfter ? new Date(query.startAfter) : undefined,
            lte: query.startBefore ? new Date(query.startBefore) : undefined,
          },
          end: {
            gte: query.endAfter ? new Date(query.endAfter) : undefined,
            lte: query.endBefore ? new Date(query.endBefore) : undefined,
          },
          createdTime: {
            gte: query.createdAfter ? new Date(query.createdAfter) : undefined,
            lte: query.createdBefore
              ? new Date(query.createdBefore)
              : undefined,
          },
          city: {
            contains: query.city,
            mode: 'insensitive',
          },
          country: {
            contains: query.country,
            mode: 'insensitive',
          },
          language: {
            contains: query.language,
            mode: 'insensitive',
          },
          organization: {
            orgName: {
              contains: query.org,
              mode: 'insensitive',
            },
          },
          isFeatured: {
            equals: query.isFeatured,
          },
          isPublished: {
            equals: isPublished,
          },
          tags: query.tags
            ? {
                some: {
                  name: {
                    contains: query.tags,
                    mode: 'insensitive',
                  },
                },
              }
            : undefined,
        },
      };

      larps = await prisma.larp.findMany({
        where: prismaFilterObject,
        include: LARP_INCLUDE_OBJ,
        orderBy: [
          {
            _relevance: {
              fields: ['title', 'description', 'country', 'city', 'language'],
              search: query.term!,
              sort: 'asc',
            },
          },
        ],
      });
    }
    return larps;
  }

  static async getLarpById(id: number): Promise<Larp> {
    try {
      const larp = await prisma.larp.findUniqueOrThrow({
        where: {
          id: id,
        },
        include: LARP_INCLUDE_OBJ,
      });
      return larp;
    } catch (err) {
      //use our custom error instead
      throw new NotFoundError('Record not found');
    }
  }

  static async updateLarp(newLarp: LarpForUpdate): Promise<Larp> {
    const currentLarp: Larp = await prisma.larp.findUniqueOrThrow({
      where: { id: newLarp.id },
      include: LARP_INCLUDE_OBJ,
    });

    const newTagNames = newLarp.tags ? newLarp.tags.map((tag) => tag.name) : [];

    const tagsToRemove = currentLarp.tags
      ? currentLarp.tags.filter((tag) => !newTagNames.includes(tag.name))
      : currentLarp.tags;

    const larp: Larp = await prisma.larp.update({
      where: { id: newLarp.id },
      data: {
        title: newLarp.title || currentLarp.title,
        description: newLarp.description || currentLarp.description,
        ticketStatus: newLarp.ticketStatus || currentLarp.ticketStatus,
        start: newLarp.start || currentLarp.start,
        end: newLarp.end || currentLarp.end,
        allDay: newLarp.allDay || currentLarp.allDay,
        city: newLarp.city || currentLarp.city,
        country: newLarp.country || currentLarp.country,
        language: newLarp.language || currentLarp.language,
        eventUrl: newLarp.eventUrl || currentLarp.eventUrl,
        isFeatured:
          newLarp.isFeatured !== undefined
            ? newLarp.isFeatured
            : currentLarp.isFeatured,
        tags: {
          connectOrCreate: newLarp.tags
            ? newLarp.tags.map((tag: Tag) => ({
                where: { name: tag.name },
                create: { name: tag.name },
              }))
            : undefined,
          disconnect: tagsToRemove,
        },
        imgUrl: {
          update: {
            data: {
              sm: newLarp.imgUrl?.sm || currentLarp.imgUrl.sm,
              md: newLarp.imgUrl?.md || currentLarp.imgUrl.md,
              lg: newLarp.imgUrl?.lg || currentLarp.imgUrl.lg,
            },
            where: { id: newLarp.imgSetId },
          },
        },
      },
      include: LARP_INCLUDE_OBJ,
    });
    return larp;
  }

  static async deleteLarpById(id: number): Promise<Larp> {
    // try { await this.deleteRecipeImage(id); }
    //   catch(err) {
    //   console.warn(`Image for recipeId ${id} could not be deleted`);
    // }

    try {
      const larp = await prisma.larp.delete({
        where: {
          id: id,
        },
        include: LARP_INCLUDE_OBJ,
      });
      return larp;
    } catch (err) {
      //use our custom error instead
      throw new NotFoundError('Record not found');
    }
  }

  /**************************** IMAGES ***************************************/

  /**Uploads a file to s3 and stores the resulting uri in the imageUrl property
   *
   * @param file: the file to upload
   * @param id: the id for the record to update
   *
   * @returns the updated larp
   */
  static async updateLarpImage(file: Express.Multer.File, id: number) {
    const larp = await LarpManager.getLarpById(+id);
    const s3Path = `larpImage/larp-${id}`;
    const basePath = `https://${BUCKET_NAME}.s3.amazonaws.com/${s3Path}`;
    const uuid = crypto.randomUUID();

    try {
      await ImageHandler.uploadAllSizes(file.buffer, s3Path, uuid);
      if (
        larp.imgUrl.sm !==
        `https://${BUCKET_NAME}.s3.amazonaws.com/larpImage/default-sm`
      ) {
        await deleteMultiple([
          larp.imgUrl.sm.replace(
            `https://${BUCKET_NAME}.s3.amazonaws.com/`,
            '',
          ),
          larp.imgUrl.md.replace(
            `https://${BUCKET_NAME}.s3.amazonaws.com/`,
            '',
          ),
          larp.imgUrl.lg.replace(
            `https://${BUCKET_NAME}.s3.amazonaws.com/`,
            '',
          ),
        ]);
      }
    } catch (e) {
      throw new BadRequestError(
        `There was a problem updating this image: ${e}`,
      );
    }

    larp.imgUrl = {
      sm: `${basePath}-sm-${uuid}`,
      md: `${basePath}-md-${uuid}`,
      lg: `${basePath}-lg-${uuid}`,
    };
    return await LarpManager.updateLarp(larp);
  }

  /**Deletes the image associated with the recipeId from s3 and updates the
   * imageUrl field.
   *
   * @param id: the recipeId for the record to update
   *
   * @returns {deleted:{imageUrl:string}}
   */
  // static async deleteRecipeImage(id: number) {
  //   const path = `recipeImage/recipe-${id}`;
  //   await deleteFile(path);

  //   const recipe = await RecipeManager.getRecipeById(id);
  //   recipe.imageSm = `${DEFAULT_IMG_URL}-sm`;
  //   recipe.imageMd = `${DEFAULT_IMG_URL}-md`;
  //   recipe.imageLg = `${DEFAULT_IMG_URL}-lg`;
  //   return await RecipeManager.updateRecipe(recipe);
  // }

  //end class
}
export default LarpManager;
