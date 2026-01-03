import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export const formatPostDate = (dateString: string | Date) => {
  const date = new Date(dateString);
  return {
    dateFormatted: date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }),
    timeFormatted: date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: false })
  };
};