export type UiComponentGroupId =
  | 'forms'
  | 'overlays'
  | 'navigation'
  | 'data'
  | 'layout'
  | 'feedback'

export type UiComponentGroup = {
  id: UiComponentGroupId
  label: string
  items: readonly string[]
}

export const UI_COMPONENT_GROUPS: UiComponentGroup[] = [
  {
    id: 'forms',
    label: 'Forms',
    items: [
      'button',
      'button-group',
      'calendar',
      'checkbox',
      'combobox',
      'field',
      'input',
      'input-group',
      'input-otp',
      'label',
      'native-select',
      'radio-group',
      'select',
      'slider',
      'switch',
      'textarea',
      'toggle',
      'toggle-group',
    ],
  },
  {
    id: 'overlays',
    label: 'Overlays',
    items: [
      'alert-dialog',
      'command',
      'context-menu',
      'dialog',
      'drawer',
      'dropdown-menu',
      'hover-card',
      'popover',
      'sheet',
      'tooltip',
    ],
  },
  {
    id: 'navigation',
    label: 'Navigation',
    items: [
      'accordion',
      'breadcrumb',
      'collapsible',
      'menubar',
      'navigation-menu',
      'pagination',
      'sidebar',
      'tabs',
    ],
  },
  {
    id: 'data',
    label: 'Data display',
    items: [
      'avatar',
      'badge',
      'card',
      'chart',
      'empty',
      'item',
      'progress',
      'skeleton',
      'spinner',
      'table',
    ],
  },
  {
    id: 'layout',
    label: 'Layout',
    items: ['aspect-ratio', 'carousel', 'direction', 'resizable', 'scroll-area', 'separator'],
  },
  {
    id: 'feedback',
    label: 'Feedback',
    items: ['alert', 'kbd', 'sonner'],
  },
]
