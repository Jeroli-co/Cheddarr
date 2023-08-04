import { IMedia } from '../models/IMedia'
import { SearchFilters } from '../enums/SearchFilters'
import { usePagination } from '../../hooks/usePagination'

export const useSearchMedia = (title: string, type: SearchFilters, page: number) => {
  return usePagination<IMedia>(['search', title, type], '/search', {
    value: title,
    type,
  })
}
