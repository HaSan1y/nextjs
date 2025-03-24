import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const handleErrors = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }
  else {
    return 'Something went wrong'
  }
}