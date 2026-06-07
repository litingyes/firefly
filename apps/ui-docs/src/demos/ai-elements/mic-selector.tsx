import {
  MicSelector,
  MicSelectorContent,
  MicSelectorEmpty,
  MicSelectorInput,
  MicSelectorItem,
  MicSelectorLabel,
  MicSelectorList,
  MicSelectorTrigger,
  MicSelectorValue,
} from '@firefly/ui/components/ai-elements/mic-selector'

import { DemoSection } from '@/components/demo-section'

export function MicSelectorDemo() {
  return (
    <DemoSection description="Requires microphone permission for device labels." title="Microphone">
      <MicSelector>
        <MicSelectorTrigger>
          <MicSelectorValue />
        </MicSelectorTrigger>
        <MicSelectorContent>
          <MicSelectorInput />
          <MicSelectorList>
            {(devices) =>
              devices.length ? (
                devices.map((device) => (
                  <MicSelectorItem key={device.deviceId} value={device.deviceId}>
                    <MicSelectorLabel device={device} />
                  </MicSelectorItem>
                ))
              ) : (
                <MicSelectorEmpty />
              )
            }
          </MicSelectorList>
        </MicSelectorContent>
      </MicSelector>
    </DemoSection>
  )
}
