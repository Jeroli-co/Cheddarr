import { z } from 'zod'

// # Media servers
export enum MediaServerEnum {
  PLEX = 'plex',
}

const postMediaServerSettingsSchema = z.object({
  // Required fields
  host: z.string().min(1, { message: 'Host is required' }).trim(),
  apiKey: z.string().min(1, { message: 'API key is required' }).trim(),
  ssl: z.boolean(),

  // Optional fields
  port: z.number().int().optional().nullable(),
  name: z.string().trim().optional(),
  enabled: z.boolean().optional(),
  version: z.number().int().optional().nullable(),
})

// ## Plex
export const postPlexSettingsSchema = postMediaServerSettingsSchema.merge(
  z.object({
    // Required fields
    serverName: z.string().min(1, { message: 'Server name is required' }).trim(),
    serverId: z.string().min(1, { message: 'Server ID is required' }).trim(),
  }),
)

export type PostPlexSettings = z.infer<typeof postPlexSettingsSchema>

export type PlexSettings = PostPlexSettings & {
  id: string
}

// ## Media providers
export enum MediaProviderEnum {
  RADARR = 'radarr',
  SONARR = 'sonarr',
}

export type ProviderQualityProfile = {
  id: number
  name: string
}

export type ProviderTag = {
  id: number
  name: string
}

type MediaProviderInstanceInfo = {
  rootFolders: string[]
  qualityProfiles: ProviderQualityProfile[]
  tags?: ProviderTag[]
}

const postMediaProviderSettingsSchema = postMediaServerSettingsSchema.merge(
  z.object({
    // Required fields
    version: z.number().int().min(0, { message: 'Version is required' }),
    rootFolder: z.string().min(1, { message: 'Root folder is required' }).trim(),
    qualityProfileId: z.number().int().min(0, { message: 'Quality profile is required' }),

    // Optional fields
    isDefault: z.boolean().optional(),
    providerType: z.enum(['movies_provider', 'series_provider']).optional(),
    tags: z.array(z.number()).optional().nullable(),
  }),
)

// ### Radarr
export type RadarrInstanceInfo = MediaProviderInstanceInfo

export const postRadarrSettingsSchema = postMediaProviderSettingsSchema

export type PostRadarrSettings = z.infer<typeof postRadarrSettingsSchema>

export type RadarrSettings = PostRadarrSettings & {
  id: string
}

// ### Sonarr
export type SonarrInstanceInfo = MediaProviderInstanceInfo & {
  animeRootFolders?: string[]
  animeQualityProfiles?: ProviderQualityProfile[]
  animeTags?: ProviderTag[]
}

export const postSonarrSettingsSchema = postMediaProviderSettingsSchema.merge(
  z.object({
    // Optional fields
    animeRootFolder: z.string().trim().optional().nullable(),
    animeQualityProfileId: z.number().int().optional().nullable(),
    animeTags: z.array(z.number()).optional().nullable(),
  }),
)

export type PostSonarrSettings = z.infer<typeof postSonarrSettingsSchema>

export type SonarrSettings = PostSonarrSettings & {
  id: string
}

// ### Common

export type PostMediaProviderSettings = PostRadarrSettings | PostSonarrSettings
export type MediaProviderSettings = RadarrSettings | SonarrSettings

export type PostMediaServerSettings = PostPlexSettings
export type MediaServerSettings = PlexSettings
