import "https://deno.land/std@0.208.0/dotenv/load.ts";

const OPENROUTER_API_KEY = Deno.env.get("OPENROUTER_API_KEY");

// Function to generate instruction data using OpenRouter API
async function generateInstructionData(
  instructionName: string,
  description: string,
) {
  const response = await fetch(
    "https://openrouter.ai/api/v1/chat/completions",
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "openai/gpt-oss-20b", // Or any other model you prefer
        messages: [
          {
            role: "system",
            content:
              `You are an expert in PIC18 microcontroller assembly language. Your task is to generate a JSON object for a given instruction, following the provided schema and style.

The JSON object must have two keys: 'description' and 'examples'.

The 'description' should explain the instruction's operation and all its possible options (like 'd' for destination and 'a' for access bank). It should also include the assembly syntax in a code block.

The 'examples' must be an array of strings. Each string should represent a single, self-contained example and must follow this format:
"; <one-line comment explaining the case>\n<INSTRUCTION> <operands> ; <trailing comment explaining the operation>"
There should be no trailing newline characters at the end of each example string.

For byte-oriented instructions with 'd' and 'a' options, you must provide 5 examples:
1. d=0, a=0
2. d=0, a=1
3. d=1, a=0
4. d=1, a=1
5. An example where WREG is pre-loaded with a literal value.

Here is the reference for the PIC18 instruction set: https://ww1.microchip.com/downloads/en/DeviceDoc/39500a.pdf

Here is an example for the ADDWF instruction that you must follow strictly:

${JSON.stringify(addwfExample, null, 2)}

Now, generate the JSON object for the instruction: ${instructionName} - ${description}.`,
          },
        ],
      }),
    },
  );

  if (!response.ok) {
    const errorBody = await response.text();
    console.error("OpenRouter API Error:", errorBody);
    throw new Error(
      `OpenRouter API request failed with status ${response.status}`,
    );
  }

  const data = await response.json();
  return JSON.parse(data.choices[0].message.content);
}

// Example of ADDWF to be used in the prompt
const addwfExample = {
  description:
    "Add the contents of **WREG** to file register `f`.\n- `d = 0` → result is stored in **WREG**.\n- `d = 1` → result is stored back into register `f`.\n- `a = 0` → Access‑bank addressing.\n- `a = 1` → Banked addressing.\n```asm\nADDWF f, [d], [a]\n```",
  examples: [
    "; d=0, a=0  → result in WREG, Access bank\nADDWF 0x20, 0, 0   ; W = 0x20 + W",
    "; d=0, a=1  → result in WREG, Banked address\nADDWF 0x20, 0, 1   ; W = 0x20 + W",
    "; d=1, a=0  → result back to file register, Access bank\nADDWF 0x20, 1, 0   ; 0x20 = 0x20 + W",
    "; d=1, a=1  → result back to file register, Banked address\nADDWF 0x20, 1, 1   ; 0x20 = 0x20 + W",
    "; Load literal into WREG then add, result in WREG (Access bank)\nMOVLW 0x10\nADDWF 0x20, 0, 0   ; W = 0x20 + 0x10",
  ],
};

// Main function to read categories and generate instruction files
async function main() {
  const categories = JSON.parse(
    await Deno.readTextFile("./data/category.json"),
  );

  for (const category of categories) {
    for (const instruction of category.instructions) {
      // Skip already existing files
      try {
        await Deno.stat(
          `./data/instructions/${instruction.name.toLowerCase()}.json`,
        );
        console.log(`Skipping ${instruction.name}, file already exists.`);
        continue;
      } catch (error) {
        if (error instanceof Deno.errors.NotFound) {
          // File does not exist, so we generate it
          console.log(`Generating data for ${instruction.name}...`);
          try {
            const instructionData = await generateInstructionData(
              instruction.name,
              instruction.description,
            );
            await Deno.writeTextFile(
              `./data/instructions/${instruction.name.toLowerCase()}.json`,
              JSON.stringify(instructionData, null, 2),
            );
            console.log(`Successfully generated ${instruction.name}.json`);
          } catch (e) {
            console.error(
              `Failed to generate data for ${instruction.name}:`,
              e,
            );
          }
        } else {
          throw error;
        }
      }
    }
  }
}

if (import.meta.main) {
  main();
}
