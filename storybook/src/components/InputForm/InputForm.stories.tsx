import type { Meta, StoryObj } from "@storybook/react-vite";
import { useState, type ComponentType } from "react";
import { elyxVariantStory, matrixStory } from "../../docs/controlStories";
import { DateField } from "./DateField";
import { Flag, type FlagCountry } from "./Flag";
import {
  dateFieldExport, flagExport, fromElyx, inputFormScene, passwordInputExport, pinInputExport, searchFieldExport, textAreaExport, textFieldExport,
} from "./InputForm.elyx";
import { PasswordInput, PinInput } from "./PinInput";
import { SearchField } from "./SearchField";
import { TextArea } from "./TextArea";
import { TextField, type TextFieldProps } from "./TextField";

const width = (w = 328) => [(S: ComponentType) => <div style={{ width: w }}><S /></div>];

const meta = {
  title: "Controls/Input Form",
  component: TextField,
  args: {
    label: "Nomor Ponsel",
    placeholder: "81234567901",
    prefix: "+62",
    helperText: "Contoh: 81234567901",
    info: true,
    clearable: true,
    showCounter: true,
    maxLength: 255,
    disabled: false,
    error: false,
    state: "default",
  },
  argTypes: {
    state: { control: "inline-radio", options: ["default", "pressed"] },
    type: { control: "inline-radio", options: ["text", "tel", "email", "password"] },
    flag: { control: "select", options: [undefined, "indonesia", "malaysia", "singapore", "unitedStates"] },
    error: { control: "boolean" },
  },
  decorators: width(),
  parameters: {
    docs: {
      description: {
        component:
          "Underline form fields for DOKU e-Wallet: `TextField` (Figma `Input Form` base form), `SearchField` (search variant), " +
          "`TextArea` (`Input Area`), `DateField` (`Input Date`), `PinInput` / `PasswordInput` (6-digit code and PIN dots) and `Flag`.\n\n" +
          "Fields are real inputs: the focused (Figma *pressed*) underline comes from focus, *filled* from the value, " +
          "*invalid* from `error` (a string replaces the helper text) and *disabled* from `disabled`. `state=\"pressed\"` only forces the focus look for docs. " +
          "Labels are associated with their input, and the helper / counter are linked with `aria-describedby`. `type=\"password\"` adds a show/hide toggle.\n\n" +
          "**Design notes:**\n" +
          "- The underline is a 0-height line in Elyx and does not appear in the Elyx renders; it is drawn here as a 1dp line (that is the whole diff on *pressed* states).\n" +
          "- Invalid base form keeps the neutral underline and only turns the helper red-70; the search variant turns the box red. Select Form's error helper is red-80.\n" +
          "- Disabled label is neutral-30 in Input Form but neutral-40 in Input Area and Input Date.\n" +
          "- The `search` variant uses off-palette greys (#4D4D4D, #666, #CCC, #B3B3B3, #EAECF0) and a 20dp line height; base form uses tokens and 16dp.\n" +
          "- The counter reads 0/255 in the *filled* designs; the coded counter counts the real value.\n" +
          "- Input Date's placeholder in the design is a phone number (\"81234567901\"); use a date hint such as \"Pilih tanggal\".\n" +
          "- Empty PIN cells are 28×20 dp, filled ones 28×28, so the row grows when the first digit lands. Filled password dots and the active-cell highlight are not in the design (neutral-80 / red-20 used).",
      },
    },
    elyxSpec: (args: TextFieldProps) => ({ file: inputFormScene.file, scene: textFieldExport(args), live: <TextField {...args} style={{ width: 317 }} /> }),
  },
} satisfies Meta<typeof TextField>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Playground: Story = {};

export const PhoneWithContacts: Story = {
  name: "Phone number + contacts",
  args: { label: "Nomor Ponsel", type: "tel", onContactClick: () => alert("Buka kontak"), helperText: undefined, showCounter: false },
};

export const CountryPicker: Story = { args: { flag: "indonesia", prefix: "+62", clearable: false, helperText: undefined, showCounter: false } };

export const Password: Story = {
  args: { label: "Kata Sandi", type: "password", prefix: undefined, placeholder: "Masukkan kata sandi", clearable: false, showCounter: false, info: false, helperText: "Minimal 8 karakter" },
};

export const Invalid: Story = { args: { defaultValue: "8123", error: "Nomor ponsel tidak valid" } };

export const Disabled: Story = { args: { defaultValue: "81234567901", disabled: true } };

export const Search: Story = {
  render: () => <SearchField label="Cari Merchant" placeholder="Nama merchant" helperText="Minimal 3 huruf" onSearch={(v) => console.log("search", v)} />,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: searchFieldExport({}), live: <SearchField label="Cari Merchant" placeholder="Nama merchant" style={{ width: 317 }} /> }) },
};

function AreaDemo() {
  const [v, setV] = useState("");
  return <TextArea label="Catatan" placeholder="Masukkan Catatan" maxLength={255} value={v} onChange={(e) => setV(e.target.value)} />;
}
export const InputArea: Story = {
  name: "Input Area",
  render: () => <AreaDemo />,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: textAreaExport({}), live: <TextArea label="Catatan" placeholder="Masukkan Catatan" maxLength={255} style={{ width: 328 }} /> }) },
};

export const InputDate: Story = {
  name: "Input Date",
  render: () => <DateField label="Tanggal Lahir" info onChange={(d) => console.log("date", d)} />,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: dateFieldExport({}), live: <DateField label="Tanggal Lahir" style={{ width: 317 }} /> }) },
};

export const Pin: Story = {
  name: "PIN input",
  render: () => <PinInput onComplete={(c) => console.log("code", c)} />,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: pinInputExport(), live: <PinInput /> }) },
};

export const PinError: Story = { name: "PIN input – wrong code", render: () => <PinInput defaultValue="111111" error /> };

export const PasswordDots: Story = {
  name: "Password input",
  render: () => <PasswordInput onComplete={(c) => console.log("pin", c)} />,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: passwordInputExport(), live: <PasswordInput /> }) },
};

const countries: FlagCountry[] = ["indonesia", "malaysia", "singapore", "unitedStates"];
export const Flags: Story = {
  render: () => <div style={{ display: "flex", gap: 16 }}>{countries.map((c) => <Flag key={c} country={c} size={32} label={c} />)}</div>,
  parameters: { elyxSpec: () => ({ file: inputFormScene.file, scene: flagExport("indonesia"), live: <Flag country="indonesia" /> }) },
};

export const AllVariants: Story = { ...(matrixStory(inputFormScene, fromElyx) as Story), decorators: [] };

export const ElyxVariant: Story = { ...(elyxVariantStory(inputFormScene, fromElyx) as Story), decorators: [] };
