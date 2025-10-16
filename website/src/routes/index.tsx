import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";

import instructions from "../../../data/pack.json";
import { LuStar, LuTerminal } from "@qwikest/icons/lucide";

export default component$(() => {
  const grouped = instructions.reduce(
    (acc: Record<string, typeof instructions>, instr) => {
      if (!acc[instr.category]) {
        acc[instr.category] = [];
      }
      acc[instr.category].push(instr);
      return acc;
    },
    {},
  );

  return (
    <div class="min-w-0 grow-1 h-screen w-screen bg-chat-bg flex justify-center py-4 overflow-y-auto text-text">
      <div class="max-w-4xl w-full space-y-8 p-4">
        {Object.entries(grouped).map(([category, items]) => (
          <section key={category}>
            <h2 class="text-2xl font-bold mb-4 border-b border-outline pb-2 select-none flex justify-start items-center">
              <LuTerminal class="h-7 w-7 inline-block -mb-1 mr-3" />
              {category}
            </h2>
            <ul class="text-md grid grid-cols-1 md:grid-cols-2 gap-y-0.5 gap-x-3">
              {items.map((item, index) => (
                <a
                  href={`/${item.name.toLowerCase()}`}
                  key={index}
                  class="text-text duration-150 not-disabled:hover:bg-primary not-disabled:hover:text-text-hover focus:ring-4 focus:ring-outline focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 rounded-lg p-2 inline-block"
                >
                  <strong>{item.name}</strong>: {item.short}
                </a>
              ))}
            </ul>
          </section>
        ))}
        <div class="flex justify-center">
          <a
            href="https://github.com/Eason0729/pic18-cheatsheet"
            target="_blank"
            class="text-text duration-150 not-disabled:hover:bg-primary not-disabled:hover:text-text-hover focus:ring-4 focus:ring-outline focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 rounded-lg p-2 font-semibold text-lg px-8"
          >
            <LuStar class="inline-block h-6 w-6 mr-2" />
            Star on github
          </a>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "PIC18 ISA Cheatsheet",
  meta: [
    {
      name: "description",
      content:
        "Quick reference for PIC18 microcontroller Instruction Set Architecture (ISA) instructions, opcodes, and formats.",
    },
  ],
};
