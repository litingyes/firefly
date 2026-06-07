import { getAiGroupForName } from '@/registry/ai-element-groups'
import type { ComponentCategory, ComponentDemoEntry } from '@/registry/types'

export type ComponentPropDoc = {
  name: string
  type: string
  description: string
}

export type ComponentMeta = {
  description: string
  usage: string
  props: ComponentPropDoc[]
  a11y: string[]
  related?: { category: ComponentCategory; name: string; title: string }[]
}

const BASE_UI_PROPS: ComponentPropDoc[] = [
  { name: 'className', type: 'string', description: 'Additional CSS classes on the root element.' },
]

const BASE_UI_A11Y = [
  'Interactive states include visible focus rings via `focus-visible`.',
  'Pair with labels for form controls; do not rely on placeholder text alone.',
]

const BASE_AI_A11Y = [
  'Compose with semantic HTML where possible; add aria labels when icons carry meaning.',
  'Announce dynamic updates with live regions when content streams or changes state.',
]

const META_OVERRIDES: Record<string, Partial<ComponentMeta>> = {
  button: {
    description: 'Triggers actions. Use one primary button per view for the main task.',
    props: [
      {
        name: 'variant',
        type: 'default | secondary | outline | ghost | destructive | link',
        description: 'Visual hierarchy and intent.',
      },
      {
        name: 'size',
        type: 'xs | sm | default | lg | icon | icon-xs | icon-sm | icon-lg',
        description: 'Tap target and density.',
      },
      {
        name: 'disabled',
        type: 'boolean',
        description: 'Prevents interaction and dims the control.',
      },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Use explicit `type="button"` in forms to avoid accidental submits.',
      'Icon-only buttons require `aria-label`.',
      'Destructive actions should use `variant="destructive"` and confirm when data loss is possible.',
    ],
    related: [
      { category: 'ui', name: 'button-group', title: 'Button Group' },
      { category: 'ui', name: 'tooltip', title: 'Tooltip' },
    ],
  },
  input: {
    description: 'Single-line text field for settings, search, and forms.',
    props: [
      {
        name: 'type',
        type: 'string',
        description: 'Native input type (text, email, password, etc.).',
      },
      {
        name: 'aria-invalid',
        type: 'boolean',
        description: 'Marks invalid state; pair with an error message.',
      },
      { name: 'disabled', type: 'boolean', description: 'Prevents editing.' },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Always associate a visible `<Label htmlFor>` with the input id.',
      'Link errors with `aria-describedby` pointing at helper or error text.',
    ],
    related: [
      { category: 'ui', name: 'label', title: 'Label' },
      { category: 'ui', name: 'field', title: 'Field' },
    ],
  },
  message: {
    description: 'Chat bubble for user and assistant turns in AI surfaces.',
    props: [
      {
        name: 'from',
        type: 'user | assistant',
        description: 'Aligns layout and styling to the speaker role.',
      },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Wrap assistant output in a region users can navigate sequentially.',
      'Preserve readable line length inside `MessageContent` for long responses.',
    ],
    related: [
      { category: 'ai-elements', name: 'conversation', title: 'Conversation' },
      { category: 'ai-elements', name: 'prompt-input', title: 'Prompt Input' },
    ],
  },
  label: {
    description: 'Accessible label for form controls. Always pair with an input id.',
    props: [
      { name: 'htmlFor', type: 'string', description: 'Matches the controlled input id.' },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Every input needs a visible label; placeholders are not substitutes.',
      'Use `htmlFor` so clicking the label focuses the control.',
    ],
    related: [
      { category: 'ui', name: 'input', title: 'Input' },
      { category: 'ui', name: 'field', title: 'Field' },
    ],
  },
  field: {
    description: 'Groups a label, control, helper text, and error message for one form field.',
    a11y: [
      'Wire `aria-describedby` from the control to helper and error elements.',
      'Show errors inline; do not rely on color alone.',
    ],
    related: [
      { category: 'ui', name: 'label', title: 'Label' },
      { category: 'ui', name: 'input', title: 'Input' },
    ],
  },
  select: {
    description: 'Dropdown for choosing one value from a predefined list.',
    props: [
      { name: 'value', type: 'string', description: 'Currently selected option value.' },
      {
        name: 'onValueChange',
        type: '(value: string) => void',
        description: 'Called when selection changes.',
      },
      { name: 'disabled', type: 'boolean', description: 'Prevents opening the menu.' },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Ensure the trigger exposes the current value to screen readers.',
      'Keyboard users must be able to open, navigate, and confirm a choice.',
    ],
    related: [
      { category: 'ui', name: 'combobox', title: 'Combobox' },
      { category: 'ui', name: 'native-select', title: 'Native Select' },
    ],
  },
  checkbox: {
    description: 'Binary toggle for opt-in settings and multi-select lists.',
    props: [
      {
        name: 'checked',
        type: 'boolean | "indeterminate"',
        description: 'Controlled checked state.',
      },
      {
        name: 'onCheckedChange',
        type: '(checked: boolean) => void',
        description: 'Called when toggled.',
      },
      { name: 'disabled', type: 'boolean', description: 'Prevents interaction.' },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Pair with a clickable label; the hit target should include both.',
      'Use indeterminate only for parent items in hierarchical lists.',
    ],
    related: [
      { category: 'ui', name: 'switch', title: 'Switch' },
      { category: 'ui', name: 'radio-group', title: 'Radio Group' },
    ],
  },
  dialog: {
    description: 'Modal overlay for focused tasks that interrupt the current flow.',
    props: [
      { name: 'open', type: 'boolean', description: 'Controlled open state.' },
      {
        name: 'onOpenChange',
        type: '(open: boolean) => void',
        description: 'Called when open state changes.',
      },
      ...BASE_UI_PROPS,
    ],
    a11y: [
      'Trap focus while open and restore focus on close.',
      'Provide a visible title; `DialogTitle` is required for screen readers.',
    ],
    related: [
      { category: 'ui', name: 'alert-dialog', title: 'Alert Dialog' },
      { category: 'ui', name: 'sheet', title: 'Sheet' },
    ],
  },
}

function defaultUsage(entry: ComponentDemoEntry): string {
  const importPath = `@firefly/ui/components/${entry.category}/${entry.name}`
  const componentName = entry.title.replace(/\s+/g, '')

  if (entry.category === 'ui') {
    return `import { ${componentName} } from '${importPath}'`
  }

  return `import { ${componentName} } from '${importPath}'`
}

function defaultDescription(entry: ComponentDemoEntry): string {
  if (entry.category === 'ai-elements') {
    const group = getAiGroupForName(entry.name)
    const groupLabel = group
      ? `${group.label.toLowerCase()} surfaces`
      : 'AI chat and tooling surfaces'
    return `${entry.title} for ${groupLabel} in Firefly apps.`
  }

  return `${entry.title} primitive from @firefly/ui.`
}

export function getComponentMeta(entry: ComponentDemoEntry): ComponentMeta {
  const override = META_OVERRIDES[entry.name]

  return {
    description: override?.description ?? entry.description ?? defaultDescription(entry),
    usage: override?.usage ?? defaultUsage(entry),
    props: override?.props ?? [
      ...BASE_UI_PROPS,
      ...(entry.category === 'ui'
        ? [
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Content rendered inside the component.',
            },
          ]
        : [
            {
              name: 'children',
              type: 'ReactNode',
              description: 'Composable child elements or text.',
            },
          ]),
    ],
    a11y: override?.a11y ?? (entry.category === 'ui' ? BASE_UI_A11Y : BASE_AI_A11Y),
    related: override?.related,
  }
}
