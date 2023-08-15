import {
  type ColumnDef,
  flexRender,
  // eslint-disable-next-line import/named
  getCoreRowModel,
  // eslint-disable-next-line import/named
  getPaginationRowModel,
  useReactTable,
  createColumnHelper,
} from '@tanstack/react-table'
import { Pagination } from './Pagination'
import { PaginationHookProps } from '../hooks/usePagination'

export const createTableColumns = <TData,>() => createColumnHelper<TData>()

export type TableColumn<TData> = ColumnDef<TData>

export type TableColumns<TData> = TableColumn<TData>[]

type TableProps<TData> = {
  columns: TableColumns<TData>
} & PaginationHookProps<TData>

export const Table = <TData,>({ columns, data, ...props }: TableProps<TData>) => {
  const table = useReactTable({
    data: data?.results ?? [],
    columns,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    pageCount: data?.pages,
    manualPagination: true,
    // debugTable: true,
  })

  return (
    <div className="flex flex-col gap-3">
      <div className="overflow-y-auto pb-3">
        <table className="whitespace-nowrap min-w-full">
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
                        <div className="flex justify-center items-center">
                          {flexRender(header.column.columnDef.header, header.getContext())}
                        </div>
                      )}
                    </th>
                  )
                })}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => {
              return (
                <tr key={row.id} className="even:bg-primary-dark">
                  {row.getVisibleCells().map((cell) => {
                    return (
                      <td key={cell.id} className="px-5 py-5">
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      <Pagination data={data} {...props} />
    </div>
  )
}
