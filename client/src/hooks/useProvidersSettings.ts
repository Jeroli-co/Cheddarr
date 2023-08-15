import { RadarrSettings, SonarrSettings } from '../schemas/media-servers'
import { useData } from './useData'

export const useRadarrSettings = () => useData<RadarrSettings[]>(['settings', 'radarr'], '/settings/radarr')

export const useSonarrSettings = () => useData<SonarrSettings[]>(['settings', 'sonarr'], '/settings/sonarr')
