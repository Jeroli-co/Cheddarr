import { useJobs } from '../../shared/hooks/useJobs'
import { Spinner } from '../../shared/components/Spinner'
import { Icon } from '../../shared/components/Icon'
import { faPause, faPlayCircle, faSync } from '@fortawesome/free-solid-svg-icons'
import { Tooltiped } from '../../shared/components/Tooltiped'
import { JobActionsEnum } from '../../shared/models/IJob'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'
import { Title } from '../../elements/Title'
import { Button } from '../../elements/button/Button'

export default () => {
  const { jobs, patchJob, isLoading, isFetching } = useJobs()

  useRoleGuard([Roles.ADMIN])

  if (isLoading || isFetching) return <Spinner />

  return (
    <>
      <Title as="h1">Server jobs</Title>

      <div className="space-y-8">
        <p>Run and get information about the available jobs on your Cheddarr server.</p>

        <div className="grid grid-cols-1 md:grid-cols-2 2xl:grid-cols-4 gap-4">
          {jobs?.map((j) => (
            <div key={j.name} className="border-2 rounded-lg border-primary p-4">
              <Title as="h2">{j.name}</Title>

              <div className="space-y-4">
                {j.nextRunTime && (
                  <p>
                    Next execution: {new Date(j.nextRunTime).toLocaleDateString()},{' '}
                    {new Date(j.nextRunTime).toLocaleTimeString()}
                  </p>
                )}

                <div className="flex items-center gap-3">
                  <Tooltiped text={'Run the job manually'}>
                    <Button mode="square" variant="outlined" onClick={() => patchJob(j.id, JobActionsEnum.RUN)}>
                      <Icon icon={faSync} />
                    </Button>
                  </Tooltiped>
                  <Tooltiped
                    text={j.nextRunTime ? "The job won't be execute anymore" : 'The job will run periodically'}
                  >
                    <Button
                      mode="square"
                      onClick={() => patchJob(j.id, j.nextRunTime ? JobActionsEnum.PAUSE : JobActionsEnum.RESUME)}
                    >
                      <Icon icon={j.nextRunTime ? faPause : faPlayCircle} />
                    </Button>
                  </Tooltiped>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}
