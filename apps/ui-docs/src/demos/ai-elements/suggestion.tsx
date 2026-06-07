import { Suggestion, Suggestions } from '@firefly/ui/components/ai-elements/suggestion'
import { toast } from 'sonner'

import { DemoSection } from '@/components/demo-section'

const suggestions = ['Summarize this thread', 'Draft a reply', 'List action items']

export function SuggestionDemo() {
  return (
    <DemoSection title="Horizontal suggestions">
      <Suggestions>
        {suggestions.map((suggestion) => (
          <Suggestion
            key={suggestion}
            onClick={(value) => toast(`Selected: ${value}`)}
            suggestion={suggestion}
          />
        ))}
      </Suggestions>
    </DemoSection>
  )
}
