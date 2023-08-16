import { useState } from 'react'
import { LogLevels } from '../shared/enums/LogLevels'
import { Title } from '../elements/Title'
import { Button } from '../elements/button/Button'

type ManageLogLevelsProps = {
  defaultValue: LogLevels
  onSave: (logLevel: LogLevels) => void
}

export const ManageLogLevels = (props: ManageLogLevelsProps) => {
  const [logLevel, setLogLevel] = useState<LogLevels>(props.defaultValue)

  const onLogLevelChange = (ll: LogLevels) => {
    setLogLevel(ll)
  }

  const onSave = () => {
    props.onSave(logLevel)
  }

  return (
    <div>
      <Title as="h3">Log level</Title>

      <div className="space-y-4">
        <div>
          <select onChange={(e) => onLogLevelChange(e.target.value as LogLevels)}>
            {Object.values(LogLevels).map((value) => (
              <option key={value} value={value} selected={logLevel === value}>
                {value}
              </option>
            ))}
          </select>
        </div>

        <Button onClick={() => onSave()}>Save</Button>
      </div>
    </div>
  )
}
