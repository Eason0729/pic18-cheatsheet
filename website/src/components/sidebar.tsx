import { component$, useSignal } from "@builder.io/qwik";
import {
  LuArrowLeft,
  LuArrowRight,
  LuTableProperties,
} from "@qwikest/icons/lucide";

import pack from "../../../data/pack.json";
import Button from "./ui/button";
import { Accordion } from "./ui/accordion";

type ArrayElement<ArrayType extends readonly unknown[]> =
  ArrayType extends readonly (infer ElementType)[] ? ElementType : never;

type Entry = ArrayElement<typeof pack>;

const categories: {
  [key: string]: Entry[];
} = {};

for (const entry of pack) {
  if (!categories[entry.category]) categories[entry.category] = [entry];
  else categories[entry.category].push(entry);
}

export default component$(
  (props: {
    class?: string;
    selectedCategory?: string;
    selectedEntry?: string;
  }) => {
    const selectedCategory = useSignal(props.selectedCategory || null);
    const selectedEntry = useSignal(props.selectedEntry || null);

    return (
      <>
        <input
          type="checkbox"
          id="sidebar-toggle"
          class="hidden peer"
          checked
        />
        <Button
          htmlFor="sidebar-toggle"
          class="p-3 absolute top-5 left-3 bg-chat-bg peer-checked:hidden cursor-pointer"
        >
          <LuArrowRight class="w-6 h-6" />
        </Button>
        <div
          class={`bg-sidebar-bg border-outline border-r p-5 flex flex-col transition-all peer-not-checked:-ml-[100vw] w-screen md:peer-not-checked:-ml-[310px] md:w-[310px] ${props["class"]}`}
        >
          <div class="flex items-center justify-between text-lg font-semibold border-b border-outline pb-1 mb-2 items-center">
            <div>
              <LuTableProperties className="w-6 h-6 mx-1 inline-block" />
              PIC18 cheatsheet
            </div>
            <Button htmlFor="sidebar-toggle" class="p-3 cursor-pointer">
              <LuArrowLeft class="w-6 h-6" />
            </Button>
          </div>
          <div class="space-y-1 grow overflow-y-auto nobar">
            <Accordion
              value={selectedCategory.value}
              entries={Object.entries(categories).map(
                ([category, entries]) => ({
                  value: category,
                  trigger: (
                    <div class="font-semibold py-2 text-lg duration-150 rounded-md hover:bg-primary px-4 select-none">
                      {category.trim().replace("Operations", "")}
                    </div>
                  ),
                  content: (
                    <>
                      {entries.map((entry: Entry) => (
                        <a
                          class="flex items-center rounded-sm text-base duration-150 hover:bg-primary p-1.5 pl-4 select-none data-[state=selected]:bg-secondary"
                          key={entry.name}
                          data-state={
                            entry.name === selectedEntry.value ? "selected" : ""
                          }
                          href={
                            "../" + encodeURIComponent(entry.name.toLowerCase())
                          }
                        >
                          {entry.name}
                        </a>
                      ))}
                    </>
                  ),
                }),
              )}
            />
          </div>
        </div>
      </>
    );
  },
);
