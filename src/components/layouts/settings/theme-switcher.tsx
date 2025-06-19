import { siteConfig } from '@/config/site.config'
import { RadioGroup } from 'rizzui/radio-group'
import { updateThemeColor } from '@core/utils/update-theme-color'
import { presetLight } from '@/config/color-presets'
import { useEffect } from 'react'
import { useColorPresetName } from '@layouts/settings/use-theme-color'
import LightMode from '@core/components/icons/light-mode'
import RadioBox from '@layouts/settings/radio-box'
import DrawerBlock from '@layouts/settings/drawer-block'

const themeOptions = ['light']

export default function ThemeSwitcher() {
  const { colorPresetName } = useColorPresetName()

  useEffect(() => {
    if (colorPresetName === 'black') {
      updateThemeColor(
        presetLight.lighter,
        presetLight.light,
        presetLight.default,
        presetLight.dark,
        presetLight.foreground
      )
    }
  }, [colorPresetName])

  // Since we're only supporting light mode, set theme to 'light'
  const theme = 'light'

  return (
    <DrawerBlock title="Appearance">
      <RadioGroup
        value={theme ?? siteConfig.mode}
        setValue={() => {
          // No-op as only light mode is supported.
        }}
        className="grid grid-cols-1 gap-4"
      >
        {themeOptions.map((item) => (
          <RadioBox
            key={item}
            value={item}
            className="className h-auto"
            contentClassName="p-0 [&_.radio-active]:ring-primary/0 peer-checked:ring-0 border-0 ring-0 peer-checked:border-0 peer-checked:[&_.radio-active]:ring-primary/100 [&_.radio-active]:ring-2 peer-checked:text-primary"
          >
            <span className="radio-active mb-3 inline-flex rounded-lg ring-offset-4 ring-offset-background">
              <LightMode aria-label="Light Mode" className="h-full w-full" />
            </span>
            <span className="inline-block w-full text-center">{item}</span>
          </RadioBox>
        ))}
      </RadioGroup>
    </DrawerBlock>
  )
}
