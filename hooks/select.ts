import { useState } from "react"

export function useSelect<T>(initialValue: T) {
  const [value, setValue] = useState<T>(initialValue)

  const handleChange = (newValue: T) => {
    setValue(newValue)
  }

  return [value, handleChange] as const
}

