import { MediaTypes } from '../shared/enums/MediaTypes'
import { useMedia } from '../hooks/useMedia'
import { IMediaRequest } from '../shared/models/IMediaRequest'
import { RequestTypes } from '../shared/enums/RequestTypes'
import { useRadarrSettings, useSonarrSettings } from '../hooks/useProvidersSettings'
import { useMemo } from 'react'
import { DangerTag, MediaTag, SuccessTag, WarningTag } from '../shared/components/Tag'
import { formatLocalDate } from '../utils/date'
import { RequestStatus } from '../shared/enums/RequestStatus'
import { Button } from '../elements/button/Button'
import { Link } from 'react-router-dom'
import { Icon } from '../shared/components/Icon'
import { faCheck, faTimes } from '@fortawesome/free-solid-svg-icons'
import { Table, TableColumns, createTableColumns } from '../elements/Table'
import { UserSmallCard } from '../shared/components/UserSmallCard'
import { Buttons } from '../shared/components/layout/Buttons'
import { Tooltiped } from '../shared/components/Tooltiped'
import { PaginationHookProps } from '../hooks/usePagination'
import { Title } from '../elements/Title'
import { type ColumnDef } from '@tanstack/react-table'
import { Spinner } from '../shared/components/Spinner'
import httpClient from '../utils/http-client'
import { useAlert } from '../shared/contexts/AlertContext'

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

const Head = ({ requestType }: { requestType: RequestTypes }) => {
  return (
    <>
      <Title as="h1">Requests {requestType === RequestTypes.INCOMING ? 'received' : 'sent'}</Title>
      <p className="mb-8">
        {requestType === RequestTypes.INCOMING
          ? 'Manage the incoming requests that has been made on this server.'
          : 'See which request you have made on the server.'}
      </p>
    </>
  )
}

const columnHelper = createTableColumns<IMediaRequest>()

export const RequestTable = ({
  requestType,
  isLoading,
  isFetching,
  data,
  invalidate,
  ...props
}: PaginationHookProps<IMediaRequest> & {
  requestType: RequestTypes
}) => {
  const { data: radarrSettings } = useRadarrSettings()
  const { data: sonarrSettings } = useSonarrSettings()
  const { pushSuccess, pushDanger } = useAlert()

  const deleteRequest = async (mediaType: MediaTypes, id: number) => {
    try {
      const res = await httpClient.delete(`/requests/${mediaType}/${id}`)
      if (res.status === 204) {
        invalidate()
        pushSuccess('Request deleted')
      } else {
        pushDanger('Failed to delete request')
      }
    } catch (e) {
      pushDanger('Failed to delete request')
    }
  }

  const columns = useMemo<TableColumns<IMediaRequest>>(
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

            if (status === RequestStatus.PENDING) return <WarningTag>{status.toUpperCase()}</WarningTag>

            if (status === RequestStatus.REFUSED) return <DangerTag>{status.toUpperCase()}</DangerTag>

            if (status === RequestStatus.APPROVED) return <SuccessTag>{status.toUpperCase()}</SuccessTag>

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
                        <Button
                          color="success"
                          mode="square"
                          size="sm"
                          onClick={() => /*onUpdateRequest(RequestStatus.APPROVED)*/ ({})}
                        >
                          <Icon icon={faCheck} />
                        </Button>
                        <Button
                          variant="outlined"
                          color="danger"
                          mode="square"
                          size="sm"
                          onClick={() => /*onUpdateRequest(RequestStatus.REFUSED)*/ ({})}
                        >
                          <Icon icon={faTimes} />
                        </Button>
                      </Buttons>
                    )}
                  </div>
                )
              },
              header: 'Provider',
              footer: (info) => info.column.id,
            },
          ),
        requestType === RequestTypes.OUTGOING &&
          columnHelper.accessor((row) => row, {
            id: 'actions',
            cell: (info) => {
              const request = info.getValue()

              if (request.status !== RequestStatus.PENDING) return undefined

              return (
                <div className="flex items-center gap-3">
                  <Tooltiped text="Delete request">
                    <Button
                      variant="outlined"
                      color="danger"
                      mode="square"
                      size="sm"
                      onClick={() => deleteRequest(request.media.mediaType, request.id)}
                    >
                      <Icon icon={faTimes} />
                    </Button>
                  </Tooltiped>
                </div>
              )
            },
            header: 'Actions',
            footer: (info) => info.column.id,
          }),
      ].filter((c) => !!c) as ColumnDef<IMediaRequest>[],
    [],
  )

  return (
    <>
      <Head requestType={requestType} />

      {(isLoading || isFetching) && <Spinner size="lg" />}

      {!(isLoading || isFetching) && (data?.results.length ?? 0) > 0 && (
        <Table
          columns={columns}
          data={data}
          isLoading={isLoading}
          isFetching={isFetching}
          invalidate={invalidate}
          {...props}
        />
      )}

      {!(isLoading || isFetching) && (data?.results.length ?? 0) === 0 && (
        <p className="font-bold">No requests to display</p>
      )}
    </>
  )
}
