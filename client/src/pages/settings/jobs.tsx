import { useJobs } from '../../shared/hooks/useJobs'
import styled from 'styled-components'
import { Spinner } from '../../shared/components/Spinner'
import { Buttons } from '../../shared/components/layout/Buttons'
import { PrimaryButton } from '../../shared/components/Button'
import { Icon } from '../../shared/components/Icon'
import { faPause, faPlayCircle, faSync } from '@fortawesome/free-solid-svg-icons'
import { Tooltiped } from '../../shared/components/Tooltiped'
import { JobActionsEnum } from '../../shared/models/IJob'
import { PrimaryLightDivider } from '../../shared/components/Divider'
import { H1 } from '../../shared/components/Titles'
import { useRoleGuard } from '../../shared/hooks/useRoleGuard'
import { Roles } from '../../shared/enums/Roles'

const JobContainer = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0 10px;

  > * {
    flex: 1 1 0;

    &:last-child {
      justify-content: flex-end;
    }
  }
`

// eslint-disable-next-line import/no-anonymous-default-export
export default () => {
  const { jobs, patchJob, isLoading, isFetching } = useJobs()

  useRoleGuard([Roles.ADMIN])

  if (isLoading || isFetching) return <Spinner />

  return (
    <>
      <H1>Jobs</H1>
      <PrimaryLightDivider />
      {jobs?.map((j, index) => (
        <>
          <JobContainer>
            <p>{j.name}</p>
            {j.nextRunTime && (
              <p>
                Next execution: {new Date(j.nextRunTime).toLocaleDateString()},{' '}
                {new Date(j.nextRunTime).toLocaleTimeString()}
              </p>
            )}
            <Buttons>
              <Tooltiped text={'Run the job manually'}>
                <PrimaryButton onClick={() => patchJob(j.id, JobActionsEnum.RUN)}>
                  <Icon icon={faSync} />
                </PrimaryButton>
              </Tooltiped>
              <Tooltiped
                text={
                  j.nextRunTime
                    ? "The job won't be execute anymore"
                    : 'The job will run periodically'
                }
              >
                <PrimaryButton
                  onClick={() =>
                    patchJob(j.id, j.nextRunTime ? JobActionsEnum.PAUSE : JobActionsEnum.RESUME)
                  }
                >
                  <Icon icon={j.nextRunTime ? faPause : faPlayCircle} />
                </PrimaryButton>
              </Tooltiped>
            </Buttons>
          </JobContainer>
          {jobs && index !== jobs.length - 1 && <PrimaryLightDivider />}
        </>
      ))}
    </>
  )
}
