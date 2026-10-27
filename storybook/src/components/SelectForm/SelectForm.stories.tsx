import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentType } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { DropdownList, ListOption, type SelectOption } from "./DropdownList";
import { SelectForm, type SelectFormProps } from "./SelectForm";
import { dropdownListExport, fromElyx, listOptionExport, selectFormExport, selectFormScene } from "./SelectForm.elyx";

const banks: SelectOption[] = [
  { value: "bca", label: "BCA" },
  { value: "bni", label: "BNI" },
  { value: "bri", label: "BRI" },
  { value: "mandiri", label: "Mandiri" },
  { value: "permata", label: "Permata", disabled: true },
  { value: "cimb", label: "CIMB Niaga" },
];

const meta = {
  title: "Controls/Select Form",
  component: SelectForm,
  args: {
    label: "Bank Tujuan",
    placeholder: "Pilih bank",
    options: banks,
    helperText: "Pilih bank penerima",
    info: true,
    disabled: false,
    error: false,
    state: "default",
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "pressed"] },
    error: { control: "boolean" },
    options: { control: false },
  },
  decorators: [(S: ComponentType) => <div style={{ width: 328, minHeight: 260 }}><S /></div>],
  parameters: {
    docs: {
      description: {
        component:
          "Select field: an underline trigger (`role=\"combobox\"`) that opens a `DropdownList` (`role=\"listbox\"`) 52dp below its top, over the helper. " +
          "Works controlled (`value` + `onChange`, `open` + `onOpenChange`) or uncontrolled (`defaultValue`, `defaultOpen`). " +
          "Keyboard: ↓/↑/Enter/Space open, ↑/↓/Home/End move, Enter/Space select, Esc closes; tapping outside closes. Disabled options are skipped.\n\n" +
          "**Design notes:**\n" +
          "- Error helper is red-80 here but red-70 in Input Form; the error state does not change the underline.\n" +
          "- The *pressed* chevron uses a 16×16 asset, the others 16×24 with the same glyph; the open list is hidden in the *pressed* export.\n" +
          "- List options use off-palette greys (#4D4D4D text, #B3B3B3 disabled, #FAFAFA selected) and the standalone list border is #EAECF0 (≈ neutral-20, which the Select Form's own list uses).\n" +
          "- The keyboard highlight (neutral-05) is not in the design; *presed* (sic) is the touch-down look.",
      },
    },
    elyxSpec: (args: SelectFormProps) => ({ file: selectFormScene.file, scene: selectFormExport(args), live: <SelectForm {...args} style={{ width: 317 }} /> }),
  },
} satisfies Meta<typeof SelectForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const Open: Story = { args: { defaultOpen: true, defaultValue: "bni" } };

function ControlledDemo() {
  const [bank, setBank] = useState<string | null>("bri");
  return (
    <div>
      <SelectForm label="Bank Tujuan" options={banks} value={bank} onChange={setBank} />
      <p style={{ marginTop: 32, fontSize: 12 }}>Terpilih: {bank ?? "-"}</p>
    </div>
  );
}
export const Controlled: Story = { render: () => <ControlledDemo /> };

export const Invalid: Story = { args: { error: "Bank wajib dipilih" } };

export const Disabled: Story = { args: { disabled: true, defaultValue: "bca" } };

export const List: Story = {
  name: "Dropdown List",
  render: () => <DropdownList style={{ width: 205 }} options={banks} value="bni" onSelect={(o) => console.log(o)} />,
  parameters: { elyxSpec: () => ({ file: selectFormScene.file, scene: dropdownListExport(5), live: <DropdownList style={{ width: 205 }} options={banks.slice(0, 5)} /> }) },
};

export const Option: Story = {
  name: "List option",
  render: () => (
    <div style={{ display: "flex", flexDirection: "column", gap: 8, alignItems: "flex-start" }}>
      <ListOption hug label="Dropdown menu" iconStart="bi-arrow-right-circle" iconEnd="bi-arrow-right-circle" />
      <ListOption hug label="Dropdown menu" selected />
      <ListOption hug label="Dropdown menu" state="pressed" />
      <ListOption hug label="Dropdown menu" disabled />
    </div>
  ),
  parameters: { elyxSpec: () => ({ file: selectFormScene.file, scene: listOptionExport({}), live: <ListOption hug label="Dropdown menu" /> }) },
};

export const AllVariants: Story = { ...(matrixStory(selectFormScene, fromElyx) as Story), decorators: [] };

export const ElyxVariant: Story = { ...(elyxVariantStory(selectFormScene, fromElyx) as Story), decorators: [] };
