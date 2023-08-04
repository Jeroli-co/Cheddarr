import { MouseEvent, useRef, useState } from 'react'
import { useOutsideAlerter } from '../shared/hooks/useOutsideAlerter'
import { SearchFilters } from '../shared/enums/SearchFilters'
import { uppercaseFirstLetter } from '../utils/strings'
import { MediaTag } from '../shared/components/Tag'
import { MediaTypes } from '../shared/enums/MediaTypes'

type SearchDropdownTypeProps = {
  selectedOption: SearchFilters
  onChange: (type: SearchFilters) => void
}

const SearchDropdownType = ({ selectedOption, onChange }: SearchDropdownTypeProps) => {
  const [isOpen, setIsOpen] = useState(false)
  const dropdownRef = useRef(null)
  useOutsideAlerter([dropdownRef], () => setIsOpen(false))

  const onDropdownClick = (e: MouseEvent) => {
    setIsOpen(!isOpen)
    e.preventDefault()
  }

  const onOptionClick = (e: MouseEvent, value: SearchFilters) => {
    setIsOpen(false)
    onChange(value)
    e.preventDefault()
  }

  return (
    <div ref={dropdownRef} onClick={onDropdownClick}>
      <div>
        {selectedOption === SearchFilters.MOVIES && <MediaTag type={MediaTypes.MOVIES} />}
        {selectedOption === SearchFilters.SERIES && <MediaTag type={MediaTypes.SERIES} />}
        {selectedOption === SearchFilters.ALL && uppercaseFirstLetter(selectedOption)}
      </div>
      <div>
        {isOpen &&
          Object.values(SearchFilters).map(
            (st, index) =>
              st !== selectedOption && (
                <div key={index} onClick={(e) => onOptionClick(e, st)}>
                  {uppercaseFirstLetter(st)}
                </div>
              )
          )}
      </div>
    </div>
  )
}

export { SearchDropdownType }
