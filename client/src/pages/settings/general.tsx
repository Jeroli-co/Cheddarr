import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { H2, H3 } from '../../shared/components/Titles'
import { PrimaryDivider, PrimaryLightDivider } from '../../shared/components/Divider'
import { useConfig } from '../../shared/hooks/useConfig'
import { RolesTree } from '../../shared/components/RolesTree'
import { ManageLogLevels } from '../../shared/components/ManageLogLevels'
import { LogLevels } from '../../shared/enums/LogLevels'

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  useRoleGuard([Roles.ADMIN])

  const { config, updateConfig } = useConfig()

  const onDefaultRolesSave = (roles: number) => {
    updateConfig({ defaultRoles: roles }, { success: 'Default roles updated' })
  }

  const onLogLevelSave = (logLevel: LogLevels) => {
    updateConfig({ logLevel: logLevel }, { success: 'Log level updated' })
  }

  return (
    <>
      <H2>Users</H2>
      <PrimaryLightDivider />
      <H3>Default user roles</H3>
      {config?.defaultRoles && (
        <RolesTree defaultValue={config.defaultRoles} onSave={onDefaultRolesSave} />
      )}
      <PrimaryDivider />
      <H2>General</H2>
      <PrimaryLightDivider />
      {config?.logLevel && (
        <ManageLogLevels defaultValue={config.logLevel} onSave={onLogLevelSave} />
      )}{' '}
    </>
  )
}
