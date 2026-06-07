import { Button, Input } from '@firefly/ui'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useState } from 'react'

interface ApiKeyInputProps {
  id: string
  value: string
  placeholder?: string
  onChange: (value: string) => void
  disabled?: boolean
}

export function ApiKeyInput({ id, value, placeholder, onChange, disabled }: ApiKeyInputProps) {
  const [visible, setVisible] = useState(false)

  return (
    <div className="relative">
      <Input
        autoComplete="off"
        className="pr-10 font-mono text-sm"
        disabled={disabled}
        id={id}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        spellCheck={false}
        type={visible ? 'text' : 'password'}
        value={value}
      />
      <Button
        aria-label={visible ? 'Hide value' : 'Show value'}
        className="absolute top-1/2 right-1 size-7 -translate-y-1/2"
        disabled={disabled}
        onClick={() => setVisible((current) => !current)}
        size="icon"
        type="button"
        variant="ghost"
      >
        {visible ? <EyeOffIcon className="size-3.5" /> : <EyeIcon className="size-3.5" />}
      </Button>
    </div>
  )
}
