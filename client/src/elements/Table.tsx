import {
  ColumnDef,
  createColumnHelper,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { IMediaRequest } from "../shared/models/IMediaRequest";
import { useRequestsContext } from "../shared/contexts/RequestsContext";
import { RequestStatus } from "../shared/enums/RequestStatus";
import { Input } from "./Input";
import { useProviders } from "../hooks/useProviders";
import { MediaTypes } from "../shared/enums/MediaTypes";
import { MediaTag } from "../shared/components/Tag";
import { formatLocalDate } from "../utils/date";
import { UserSmallCard } from "../shared/components/UserSmallCard";
import { useMemo } from "react";
import { useMedia } from "../hooks/useMedia";

const MediaTitleCell = ({ id, type }: { type: MediaTypes; id: string }) => {
  const { data, isLoading } = useMedia(type, id);

  if (isLoading) return undefined;
  if (!data) return undefined;

  const { title, posterUrl } = data;

  return (
    <div className="flex items-center gap-3">
      <div className="w-[60px]">
        <img className="w-full h-auto rounded" src={posterUrl} alt="poster" />
      </div>
      <div>{title}</div>
    </div>
  );
};

const columnHelper = createColumnHelper<IMediaRequest>();
export const TestTable = () => {
  const { radarrConfigs, sonarrConfigs } = useProviders();

  const columns = useMemo<ColumnDef<IMediaRequest>[]>(
    () => [
      columnHelper.accessor((row) => row.media, {
        id: "title",
        cell: (info) => {
          const value = info.getValue();
          const { mediaType: type, tmdbId: id } = value;
          return <MediaTitleCell id={id} type={type} />;
        },
        header: "Title",
        footer: (props) => props.column.id,
      }),
      columnHelper.accessor((row) => row.media, {
        id: "type",
        cell: (info) => <MediaTag media={info.getValue()} />,
        header: "Type",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.requestingUser, {
        id: "requesting_user",
        cell: (info) => <UserSmallCard user={info.getValue()} />,
        header: "Requesting user",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.createdAt, {
        id: "created_at",
        cell: (info) => formatLocalDate(new Date(info.getValue())),
        header: "Created at",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.updatedAt, {
        id: "updated_at",
        cell: (info) => formatLocalDate(new Date(info.getValue())),
        header: "Updated at",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor((row) => row.status, {
        id: "status",
        cell: (info) => info.getValue(),
        header: "Status",
        footer: (info) => info.column.id,
      }),
      columnHelper.accessor(
        (row) => ({
          status: row.media.status,
          type: row.media.mediaType,
        }),
        {
          id: "provider",
          cell: (info) => {
            const value = info.getValue();

            const { status, type } = value;

            if (status === RequestStatus.PENDING) return undefined;

            const providers =
              type === MediaTypes.MOVIES ? radarrConfigs : sonarrConfigs;

            if (!providers?.length) return <span>No providers</span>;

            return (
              <Input>
                <select onChange={(e) => console.log(e)}>
                  {providers.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </Input>
            );
          },
          header: "Provider",
          footer: (info) => info.column.id,
        },
      ),
    ],
    [],
  );

  const { requestsReceived: data, isLoading } = useRequestsContext();

  if (isLoading) return undefined;

  return (
    <Table
      {...{
        data: data?.results ?? [],
        columns,
      }}
    />
  );
};

const Table = ({
  data,
  columns,
}: {
  data: IMediaRequest[];
  columns: ColumnDef<IMediaRequest>[];
}) => {
  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-y-auto pb-3">
        <table className="whitespace-nowrap">
          <thead>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <th
                      key={header.id}
                      colSpan={header.colSpan}
                      className="px-5 py-3 bg-primary-dark first:rounded-tl last:rounded-tr"
                    >
                      {header.isPlaceholder ? null : (
                        <div>
                          {flexRender(
                            header.column.columnDef.header,
                            header.getContext(),
                          )}
                        </div>
                      )}
                    </th>
                  );
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="even:bg-primary">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="px-5 py-5">
                        {flexRender(
                          cell.column.columnDef.cell,
                          cell.getContext(),
                        )}
                      </td>
                    );
                  })}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 md:col-start-2 place-self-center">
          <button
            onClick={() => table.setPageIndex(0)}
            disabled={!table.getCanPreviousPage()}
          >
            {"<<"}
          </button>

          <button
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            {"<"}
          </button>

          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of{" "}
              {table.getPageCount()}
            </strong>
          </span>

          <button
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            {">"}
          </button>

          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {">>"}
          </button>

          {/*
            <span className="flex items-center gap-1">
              | Go to page:
              <Input
                type="number"
                label="Go to page"
                defaultValue={table.getState().pagination.pageIndex + 1}
                onChange={(e) => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0;
                  table.setPageIndex(page);
                }}
              />
            </span>
          */}
        </div>

        <div className="place-self-end">
          <select
            value={table.getState().pagination.pageSize}
            onChange={(e) => {
              table.setPageSize(Number(e.target.value));
            }}
          >
            {[10, 20, 40, 80, 160].map((pageSize) => (
              <option key={pageSize} value={pageSize}>
                Show {pageSize}
              </option>
            ))}
          </select>
        </div>

        {/*
        <div>{table.getRowModel().rows.length} Rows</div>
        <pre>{JSON.stringify(table.getState().pagination, null, 2)}</pre>
        */}
      </div>
    </div>
  );
};
