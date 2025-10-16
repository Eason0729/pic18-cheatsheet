import { walk } from "https://deno.land/std@0.224.0/fs/walk.ts";

const instructionsDir =
  "/project/eason/course/microprocessor/cheatsheet/data/instructions";

async function cleanFile(path: string) {
  try {
    const content = await Deno.readTextFile(path);
    const data = JSON.parse(content);

    if (data.description) {
      const regex = /```asm[\s\S]*?```$/;
      const match = data.description.match(regex);

      if (match) {
        const blockLength = match[0].length;
        data.description = data.description.slice(0, -blockLength).trim();
      }
    }

    // Write back the cleaned JSON
    const cleanedContent = JSON.stringify(data, null, 2) + "\n";
    await Deno.writeTextFile(path, cleanedContent);
    console.log(`Cleaned: ${path}`);
  } catch (error) {
    console.error(`Error processing ${path}:`, error);
  }
}

for await (const entry of walk(instructionsDir, { match: [/\.json$/] })) {
  if (entry.isFile) {
    await cleanFile(entry.path);
  }
}

console.log("Cleaning complete.");
