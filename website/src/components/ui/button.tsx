import { component$, HTMLAttributes, Slot } from "@builder.io/qwik";

export default component$(
  (
    props: HTMLAttributes<HTMLLabelElement> & {
      class?: string;
    },
  ) => {
    return (
      <label
        {...props}
        class={`border border-outline text-center text-text duration-150 not-disabled:hover:bg-primary not-disabled:hover:text-text-hover focus:ring-4 focus:ring-outline focus:outline-none disabled:cursor-not-allowed disabled:opacity-60 rounded-lg p-3 inline-block ${props["class"]}`}
      >
        <Slot />
      </label>
    );
  },
);
