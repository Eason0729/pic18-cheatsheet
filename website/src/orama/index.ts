import { type Orama, create, insertMultiple, search } from "@orama/orama";
import instructions from "../../../data/pack.json";

export const instructionSchema = {
  name: "string",
  description: "string",
  examples: "string[]",
  category: "string",
};

export let oramaDb: Orama<typeof instructionSchema>;

export const createOramaDb = async () => {
  if (oramaDb) {
    return;
  }
  const db = await create({
    schema: instructionSchema,
  });

  await insertMultiple(db, instructions as never);

  oramaDb = db;
};

export async function searchInstructions(term: string) {
  if (!oramaDb) {
    await createOramaDb();
  }
  return await search(oramaDb, {
    term,
    properties: "*",
    boost: {
      name: 3,
      category: 2,
      description: 1,
      examples: 1,
    },
  });
}

createOramaDb();
