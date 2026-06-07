import {
  AudioPlayer,
  AudioPlayerControlBar,
  AudioPlayerDurationDisplay,
  AudioPlayerElement,
  AudioPlayerPlayButton,
  AudioPlayerTimeDisplay,
  AudioPlayerTimeRange,
} from '@firefly/ui/components/ai-elements/audio-player'

import { DemoSection } from '@/components/demo-section'

export function AudioPlayerDemo() {
  return (
    <DemoSection title="Playback controls">
      <AudioPlayer className="max-w-md">
        <AudioPlayerElement src="https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3" />
        <AudioPlayerControlBar>
          <AudioPlayerPlayButton />
          <AudioPlayerTimeDisplay />
          <AudioPlayerTimeRange />
          <AudioPlayerDurationDisplay />
        </AudioPlayerControlBar>
      </AudioPlayer>
    </DemoSection>
  )
}
