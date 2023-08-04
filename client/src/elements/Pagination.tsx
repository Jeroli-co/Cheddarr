import { Button } from './button/Button'
import { PaginationHookProps } from '../hooks/usePagination'
import { Icon } from '../shared/components/Icon'
import { faChevronLeft, faChevronRight } from '@fortawesome/free-solid-svg-icons'

type PaginationProps<TData> = PaginationHookProps<TData>

export const Pagination = <TData,>({
  page,
  isFirstPage,
  isLastPage,
  firstPage,
  lastPage,
  loadPage,
  loadPrev,
  loadNext,
}: PaginationProps<TData>) => {
  return (
    <>
      <div className="flex justify-center">
        <div className="flex items-center gap-3">
          <Button variant="text" mode="square" size="sm" onClick={() => loadPage(firstPage)} disabled={isFirstPage}>
            {'<<'}
          </Button>

          <Button mode="square" size="sm" onClick={() => loadPrev()} disabled={isFirstPage}>
            <Icon icon={faChevronLeft} />
          </Button>

          <span className="flex items-center gap-1 text-sm md:text-base">
            <div>Page</div>
            <strong>
              {page} of {lastPage}
            </strong>
          </span>

          <Button mode="square" size="sm" onClick={() => loadNext()} disabled={isLastPage}>
            <Icon icon={faChevronRight} />
          </Button>

          <Button variant="text" mode="square" size="sm" onClick={() => loadPage(lastPage)} disabled={isLastPage}>
            {'>>'}
          </Button>
        </div>
      </div>

      {/* <Input
          type="number"
          label="Go to page"
          defaultValue={page}
          onChange={(e) => loadPage(e.target.value ? Number(e.target.value) : 0)}
        /> */}

      {/* <Input asChild>
        <select
          className="place-self-end"
          value={perPage}
          onChange={(e) => {
            loadPerPage(Number(e.target.value))
          }}
        >
          {[10, 20, 40, 80, 160].map((v) => (
            <option key={v} value={v}>
              Show {v}
            </option>
          ))}
        </select>
      </Input> */}
    </>
  )
}
