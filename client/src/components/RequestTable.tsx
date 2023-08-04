import { MediaTypes } from '../shared/enums/MediaTypes'
import { useMedia } from '../hooks/useMedia'
import { ColumnDef, createColumnHelper } from '@tanstack/react-table'
import { IMediaRequest } from '../shared/models/IMediaRequest'
import { RequestTypes } from '../shared/enums/RequestTypes'
import { useRadarrSettings, useSonarrSettings } from '../hooks/useProvidersSettings'
import { useMemo } from 'react'
import { DangerTag, MediaTag, SuccessTag, WarningTag } from '../shared/components/Tag'
import { formatLocalDate } from '../utils/date'
import { RequestStatus } from '../shared/enums/RequestStatus'
import { Button } from '../elements/button/Button'
import { Link } from 'react-router-dom'
import { DangerIconButton, SuccessButton } from '../shared/components/Button'
import { Icon } from '../shared/components/Icon'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Table } from '../elements/Table'
import { UserSmallCard } from '../shared/components/UserSmallCard'
import { Buttons } from '../shared/components/layout/Buttons'
import { Tooltiped } from '../shared/components/Tooltiped'
import { PaginationHookProps } from '../hooks/usePagination'
import { Title } from '../elements/Title'

const MediaTitleCell = ({ id, type }: { type: MediaTypes; id: string }) => {
  const { data, isLoading } = useMedia(type, id)

  if (isLoading) return undefined
  if (!data) return undefined

  const { title, posterUrl } = data

  return (
    <div className="flex items-center gap-3">
      <div className="w-[60px]">
        <img className="w-full h-auto rounded" src={posterUrl} alt="poster" />
      </div>
      <div>{title}</div>
    </div>
  )
}

const columnHelper = createColumnHelper<IMediaRequest>()
export const RequestTable = ({
  requestType,
  isLoading,
  loadPrev,
  loadNext,
  isFirstPage,
  isLastPage,
  data,
}: PaginationHookProps<IMediaRequest> & {
  requestType: RequestTypes
}) => {
  const { data: radarrSettings } = useRadarrSettings()
  const { data: sonarrSettings } = useSonarrSettings()

  const columns = useMemo<ColumnDef<IMediaRequest>[]>(
    () =>
      [
        requestType === RequestTypes.INCOMING
          ? columnHelper.accessor((row) => row.requestingUser, {
              id: 'requesting_user',
              cell: (info) => <UserSmallCard user={info.getValue()} />,
              header: 'Requesting user',
              footer: (info) => info.column.id,
            })
          : undefined,
        columnHelper.accessor((row) => row.media, {
          id: 'title',
          cell: (info) => {
            const value = info.getValue()
            const { mediaType: type, tmdbId: id } = value
            return <MediaTitleCell id={id} type={type} />
          },
          header: 'Title',
          footer: (props) => props.column.id,
        }),
        columnHelper.accessor((row) => row.media, {
          id: 'type',
          cell: (info) => <MediaTag media={info.getValue()} />,
          header: 'Type',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.createdAt, {
          id: 'created_at',
          cell: (info) => formatLocalDate(new Date(info.getValue())),
          header: 'Created at',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.updatedAt, {
          id: 'updated_at',
          cell: (info) => formatLocalDate(new Date(info.getValue())),
          header: 'Updated at',
          footer: (info) => info.column.id,
        }),
        columnHelper.accessor((row) => row.status, {
          id: 'status',
          cell: (info) => {
            const status = info.getValue()

            if (status === RequestStatus.PENDING)
              return <WarningTag>{status.toUpperCase()}</WarningTag>

            if (status === RequestStatus.REFUSED)
              return <DangerTag>{status.toUpperCase()}</DangerTag>

            if (status === RequestStatus.APPROVED)
              return <SuccessTag>{status.toUpperCase()}</SuccessTag>

            return undefined
          },
          header: 'Status',
          footer: (info) => info.column.id,
        }),
        requestType === RequestTypes.INCOMING &&
          columnHelper.accessor(
            (row) => ({
              status: row.status,
              type: row.media.mediaType,
            }),
            {
              id: 'provider',
              cell: (info) => {
                const value = info.getValue()

                const { status, type } = value

                const providers = type === MediaTypes.MOVIES ? radarrSettings : sonarrSettings

                if (!providers?.length)
                  return (
                    <Button color="secondary" size="sm" asChild>
                      <Link to="/settings/media-providers">Configure</Link>
                    </Button>
                  )

                return (
                  <div className="flex items-center gap-3">
                    <select onChange={(e) => console.log(e)}>
                      {providers.map((p) => (
                        <option key={p.id} value={p.id}>
                          {p.name}
                        </option>
                      ))}
                    </select>

                    {status === RequestStatus.PENDING && (
                      <Buttons>
                        <SuccessButton
                          onClick={() => /*onUpdateRequest(RequestStatus.APPROVED)*/ {}}
                        >
                          <Icon icon={faCheck} />
                        </SuccessButton>
                        <DangerIconButton
                          onClick={() => /*onUpdateRequest(RequestStatus.REFUSED)*/ {}}
                        >
                          <Icon icon={faTimes} />
                        </DangerIconButton>
                      </Buttons>
                    )}
                  </div>
                )
              },
              header: 'Provider',
              footer: (info) => info.column.id,
            }
          ),
        requestType === RequestTypes.OUTGOING &&
          columnHelper.accessor((row) => row.status, {
            id: 'actions',
            cell: (info) => {
              const status = info.getValue()

              if (status !== RequestStatus.PENDING) return undefined

              return (
                <div className="flex items-center gap-3">
                  <Tooltiped text="Delete request">
                    <DangerIconButton
                      onClick={() => /*deleteRequest(request.media.mediaType, request.id)*/ {}}
                    >
                      <Icon icon={faTimes} />
                    </DangerIconButton>
                  </Tooltiped>
                </div>
              )
            },
            header: 'Actions',
            footer: (info) => info.column.id,
          }),
      ].filter((c) => !!c) as ColumnDef<IMediaRequest>[],
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  const Head = () => {
    return (
      <>
        <Title as="h1">
          Requests {requestType === RequestTypes.INCOMING ? 'received' : 'sent'}
        </Title>
        <p className="mb-8">
          {requestType === RequestTypes.INCOMING
            ? 'Manage the incoming requests that has been made on this server.'
            : 'See which request you have made on the server.'}
        </p>
      </>
    )
  }

  if (isLoading) return undefined

  return (
    <>
      <Head />
      <Table
        {...{
          data: data?.results ?? [],
          columns,
        }}
      />
    </>
  )
}
