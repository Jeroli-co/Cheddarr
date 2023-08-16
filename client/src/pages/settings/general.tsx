import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { useConfig } from '../../shared/hooks/useConfig'
import { RolesTree } from '../../components/RolesTree'
import { ManageLogLevels } from '../../components/ManageLogLevels'
import { LogLevels } from '../../shared/enums/LogLevels'
import { Title } from '../../elements/Title'

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
      <Title as="h1">Manage users</Title>
      <Title as="h2">Default user roles</Title>

      <div className="flex flex-col gap-8">
        {config?.defaultRoles && <RolesTree defaultValue={config.defaultRoles} onSave={onDefaultRolesSave} />}

        <div>
          <Title as="h2">General</Title>
          {config?.logLevel && <ManageLogLevels defaultValue={config.logLevel} onSave={onLogLevelSave} />}
        </div>
      </div>
    </>
  )
}
