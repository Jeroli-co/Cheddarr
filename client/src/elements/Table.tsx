import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  getPaginationRowModel,
  useReactTable,
} from '@tanstack/react-table'

export const Table = <TData,>({
  data,
  columns,
}: {
  data: TData[]
  columns: ColumnDef<TData>[]
}) => {
  const table = useReactTable({
    data,
    columns,
    // Pipeline
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    //
    debugTable: true,
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
                        <div>{flexRender(header.column.columnDef.header, header.getContext())}</div>
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
                <tr key={row.id} className="even:bg-primary">
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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="flex items-center gap-3 md:col-start-2 place-self-center">
          <button onClick={() => table.setPageIndex(0)} disabled={!table.getCanPreviousPage()}>
            {'<<'}
          </button>

          <button onClick={() => table.previousPage()} disabled={!table.getCanPreviousPage()}>
            {'<'}
          </button>

          <span className="flex items-center gap-1">
            <div>Page</div>
            <strong>
              {table.getState().pagination.pageIndex + 1} of {table.getPageCount()}
            </strong>
          </span>

          <button onClick={() => table.nextPage()} disabled={!table.getCanNextPage()}>
            {'>'}
          </button>

          <button
            onClick={() => table.setPageIndex(table.getPageCount() - 1)}
            disabled={!table.getCanNextPage()}
          >
            {'>>'}
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
              table.setPageSize(Number(e.target.value))
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
  )
}
