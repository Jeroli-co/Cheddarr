import { RadarrSettings } from '../components/RadarrSettingsForm'
import { SonarrSettings } from '../components/SonarrSettingsForm'
import { useData } from './useData'

export const useRadarrSettings = () =>
  useData<RadarrSettings[]>(['settings', 'radarr'], '/settings/radarr')

export const useSonarrSettings = () =>
  useData<SonarrSettings[]>(['settings', 'sonarr'], '/settings/sonarr')
