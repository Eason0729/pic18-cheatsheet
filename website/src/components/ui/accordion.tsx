import { component$, JSXOutput } from "@builder.io/qwik";

interface AccordionEntry {
  trigger: JSXOutput;
  content: JSXOutput;
  value: string;
}

interface AccordionProps {
  entries: AccordionEntry[];
  value: string | null;
}

export const Accordion = component$<AccordionProps>((props) => {
  const initialSelected = props.value;

  return (
    <div class="accordion">
      {props.entries.map((entry) => (
        <>
          <input
            type="radio"
            id={"empty" + entry.value}
            name="accordion"
            class="accordion__input"
          />
          <div key={entry.value}>
            <input
              type="radio"
              id={entry.value}
              name="accordion"
              class="accordion__input"
              checked={entry.value === initialSelected}
            />
            <label for={"empty" + entry.value} class="accordion__empty_header">
              {entry.trigger}
            </label>
            <label for={entry.value} class="accordion__header">
              {entry.trigger}
            </label>

            <div class="accordion__content">{entry.content}</div>
          </div>
        </>
      ))}
    </div>
  );
});
