interface categoryJSON {
  category_name: string;
  instructions: Array<{
    name: string;
    description: string;
  }>;
}
interface InstructionJSON {
  name?: string;
  category?: string;
  description: string;
  examples: string[];
  short?: string;
}

const categories: categoryJSON[] = JSON.parse(
  await Deno.readTextFile("./data/category.json"),
);

let promises = [];
let result = [];

categories.forEach((category) => {
  category.instructions.forEach((metadata) => {
    promises.push(
      Deno.readTextFile(
        `./data/instructions/${metadata.name.toLowerCase()}.json`,
      ).then((text) => {
        let instruction: InstructionJSON = JSON.parse(text);
        instruction.category = category.category_name;
        instruction.name = metadata.name;
        instruction.short = metadata.description;
        result.push(instruction);
      }),
    );
  });
});

await Promise.all(promises);

await Deno.writeTextFile("data/pack.json", JSON.stringify(result));
