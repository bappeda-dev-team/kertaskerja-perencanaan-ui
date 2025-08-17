import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * Utility untuk merge className
 * - clsx → handle conditional classes
 * - tailwind-merge → resolve conflict tailwind (misalnya `px-2` vs `px-4`)
 */
export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}
