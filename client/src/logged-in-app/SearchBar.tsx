import { ChangeEventHandler, useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router'
import { Input } from '../elements/Input'
import debounce from 'lodash.debounce'
import { faSearch } from '@fortawesome/free-solid-svg-icons'

export const SearchBar = () => {
  const navigate = useNavigate()

  const [value, setValue] = useState('')

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value)
  }

  const debouncedResults = useMemo(() => {
    return debounce(handleChange, 300)
  }, [])

  useEffect(() => {
    return () => {
      debouncedResults.cancel()
    }
  })

  useEffect(() => {
    if (value.trim().length) navigate(`/search?value=${value}`)
  }, [value])

  return (
    <div className="w-full">
      <Input
        type="text"
        onChange={debouncedResults}
        placeholder="Search for movies, series, actors, studio..."
        className="w-full md:w-1/3 focus:w-full transition-width duration-300 ease-in-out"
        icon={faSearch}
      />
    </div>
  )
}
