import { useState } from 'react'
import { Roles } from '../shared/enums/Roles'
import { calcRolesSumExceptAdmin, checkRole } from '../utils/roles'
import { Checkbox } from '../elements/Checkbox'
import { Button } from '../elements/button/Button'

type DefaultRolesTreeProps = {
  defaultValue: number
  onSave: (roles: number) => void
}

export const RolesTree = ({ defaultValue, onSave }: DefaultRolesTreeProps) => {
  const [roles, setRoles] = useState(defaultValue)

  const onRoleChange = (r: Roles) => {
    if (r === Roles.ADMIN) {
      setRoles(roles === Roles.ADMIN ? calcRolesSumExceptAdmin() : Roles.ADMIN)
    } else if (checkRole(roles, [r])) {
      setRoles(roles - r)
    } else {
      setRoles(roles + r)
    }
  }

  return (
    <div className="space-y-3">
      <Checkbox label="Admin" onChange={() => onRoleChange(Roles.ADMIN)} checked={checkRole(roles, [Roles.ADMIN])} />
      <Checkbox
        label="Request"
        onChange={() => onRoleChange(Roles.REQUEST)}
        checked={checkRole(roles, [Roles.REQUEST])}
        disabled={checkRole(roles, [Roles.ADMIN])}
      />
      <Checkbox
        label="Manage settings"
        onChange={() => onRoleChange(Roles.MANAGE_SETTINGS)}
        checked={checkRole(roles, [Roles.MANAGE_SETTINGS])}
        disabled={checkRole(roles, [Roles.ADMIN])}
      />
      <Checkbox
        label="Manage request"
        onChange={() => onRoleChange(Roles.MANAGE_REQUEST)}
        checked={checkRole(roles, [Roles.MANAGE_REQUEST])}
        disabled={checkRole(roles, [Roles.ADMIN])}
      />
      <Checkbox
        label="Manage users"
        onChange={() => onRoleChange(Roles.MANAGE_USERS)}
        checked={checkRole(roles, [Roles.MANAGE_USERS])}
        disabled={checkRole(roles, [Roles.ADMIN])}
      />
      <Checkbox
        label="Auto approve request"
        onChange={() => onRoleChange(Roles.AUTO_APPROVE)}
        checked={checkRole(roles, [Roles.AUTO_APPROVE])}
        disabled={checkRole(roles, [Roles.ADMIN])}
      />

      <Button onClick={() => onSave(roles)}>Save</Button>
    </div>
  )
}
