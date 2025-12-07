import { prisma } from "../../prismaSingleton";
import { describe, expect, test } from "@jest/globals";

const mockPrisma = prisma as unknown as DeepMockProxy<PrismaClient>;

import LarpManager from "../LarpManager";
import { testLarp, testLarpForCreate } from "../../test/testLarpData";
import { DeepMockProxy } from "jest-mock-extended";
import { PrismaClient } from "@prisma/client";

describe("Test post events/", function () {
  test("Works", async function () {
    //set up mocks
    // @ts-expect-error -- Not sure how to type this.
    mockPrisma.larp.create.mockResolvedValueOnce({ ...testLarp });
    // @ts-expect-error -- Not sure how to type this.
    mockPrisma.larp.findUniqueOrThrow.mockResolvedValueOnce(testLarp);

    //run test
    const larp = await LarpManager.createLarp(testLarpForCreate);

    expect(mockPrisma.larp.create).toHaveBeenCalledTimes(1);

    expect(larp).toEqual(testLarp);
  });
});
