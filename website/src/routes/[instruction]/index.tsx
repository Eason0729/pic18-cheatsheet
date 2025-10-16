import { component$, useSignal, useTask$ } from "@builder.io/qwik";
import type {
  DocumentHead,
  StaticGenerateHandler,
} from "@builder.io/qwik-city";
import { routeLoader$ } from "@builder.io/qwik-city";
import pack from "../../../../data/pack.json";
import Sidebar from "~/components/sidebar";
import { marked } from "marked";
import { codeToHtml } from "shiki";

export const useInstruction = routeLoader$(({ params }) => {
  const instr = pack.find((i) => i.name.toLowerCase() === params.instruction);
  if (!instr) {
    throw new Response("Not Found", { status: 404 });
  }
  return instr;
});

const Code = component$(({ code }: { code: string }) => {
  const html = useSignal("");

  useTask$(async () => {
    const [dark, light] = await Promise.all([
      codeToHtml(code, {
        lang: "asm",
        theme: "github-dark",
      }),
      codeToHtml(code, {
        lang: "asm",
        theme: "github-light",
      }),
    ]);

    html.value = `<div class="p-3 bg-code-bg rounded mb-4 overflow-auto border border-gray-300"><div class="dark:block hidden">${dark}</div><div class="dark:hidden">${light}</div></div>`;
  });

  return <div dangerouslySetInnerHTML={html.value} />;
});

export default component$(() => {
  const instr = useInstruction();

  return (
    <div class="flex flex-row h-screen w-screen md:static relative">
      <Sidebar
        class="shrink-0 h-full md:w-auto w-screen absolute md:static"
        selectedCategory={instr.value.category}
        selectedEntry={instr.value.name}
      />
      <div class="min-w-0 grow-1 h-full bg-chat-bg flex justify-center">
        <div class="p-8 max-w-4xl bg-primary-50 h-screen flex flex-col overflow-y-auto nobar">
          <h1 class="text-4xl font-bold mb-8 text-center text-primary-800">
            {instr.value.name}
          </h1>
          <p class="text-lg mb-8 text-center text-primary-700">
            Detailed reference for the {instr.value.name} instruction in PIC18
            ISA.
          </p>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              Description
            </h2>
            <div
              class="text-primary-700 mb-4 text-lg"
              dangerouslySetInnerHTML={
                marked.parse(instr.value.description) as string
              }
            ></div>
          </section>

          <section class="mb-8">
            <h2 class="text-2xl font-semibold mb-4 text-primary-800">
              Examples
            </h2>
            {instr.value.examples.map((ex: string, idx: number) => (
              <Code code={ex} key={idx} />
            ))}
          </section>

          <footer class="text-center text-primary-600 mt-auto">
            <p>
              Back to{" "}
              <a href="/" class="underline">
                PIC18 ISA Cheatsheet
              </a>
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = ({ params }) => {
  const instr = pack.find((i) => i.name.toLowerCase() === params.instruction);

  return {
    title: instr
      ? `${instr.name} - PIC18 ISA Cheatsheet`
      : "Instruction - PIC18 ISA Cheatsheet",
    meta: [
      {
        name: "description",
        content: instr
          ? `${instr.name} instruction details for PIC18 microcontroller.`
          : "PIC18 instruction details.",
      },
    ],
  };
};

export const onStaticGenerate: StaticGenerateHandler = async () => {
  return {
    params: pack.map((x) => ({ instruction: x.name.toLowerCase() })),
  };
};
