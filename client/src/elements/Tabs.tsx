import { useLocation, useNavigate } from 'react-router'
import { Tab as HTab } from '@headlessui/react'
import { cn } from '../utils/strings'

export type TabsConfig = {
  label: string
  uri: string
}[]

export type TabsProps = {
  config: TabsConfig
}

export const Tabs: React.FC<React.PropsWithChildren<TabsProps>> = ({ config, children }) => {
  const navigate = useNavigate()
  const location = useLocation()

  const currentPath = location.pathname.split('/').pop()
  const currentIndex = config.findIndex((tab) => tab.uri === currentPath)

  const onChange = (index: number) => {
    navigate(`./${config[index].uri}`)
  }

  return (
    <HTab.Group selectedIndex={currentIndex} onChange={onChange}>
      <HTab.List className="flex items-center gap-3 mb-8 overflow-x-auto whitespace-nowrap">
        {config.map(({ label, uri }) => (
          <HTab
            key={uri}
            className={({ selected }) =>
              cn(
                'w-full rounded-lg px-3 py-2.5 text-sm font-medium leading-5',
                selected
                  ? 'ring-primary ring-inset ring-offset-4 ring-offset-white focus:outline-none focus:ring-2'
                  : '',
                selected ? 'bg-white text-primary shadow' : 'text-white hover:bg-white/[0.12] hover:text-white',
              )
            }
          >
            {label}
          </HTab>
        ))}
      </HTab.List>
      {children}
    </HTab.Group>
  )
}
