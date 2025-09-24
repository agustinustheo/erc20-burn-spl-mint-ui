import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Formats a token amount from wei (raw blockchain units) to human-readable format
 * @param weiAmount - The amount in wei (string or number)
 * @param decimals - Number of decimals for the token (default: 18)
 * @returns Formatted human-readable amount
 */
export function formatTokenAmount(weiAmount: string | number, decimals: number = 18): string {
  const amount = typeof weiAmount === 'string' ? parseFloat(weiAmount) : weiAmount;
  const divisor = Math.pow(10, decimals);
  const humanAmount = amount / divisor;
  
  // Format with appropriate decimal places
  if (humanAmount >= 1) {
    return humanAmount.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 6 
    });
  } else {
    return humanAmount.toLocaleString(undefined, { 
      minimumFractionDigits: 0, 
      maximumFractionDigits: 8 
    });
  }
}

/**
 * Gets the number of decimals for a specific token
 * @param tokenAddress - The token contract address
 * @returns Number of decimals (default: 18)
 */
export function getTokenDecimals(tokenAddress: string): number {
  // Token decimals based on destination network (Solana)
  // Add specific cases here if needed
  const penguAddress = import.meta.env.VITE_PENGU_TOKEN_ADDRESS?.toLowerCase() || '0x4e0debf0c8795a7861a64df7f136f989921d0247';

  switch (tokenAddress.toLowerCase()) {
    case penguAddress: // PENGU - uses 9 decimals on Solana
      return 9;
    default:
      return 18; // Standard ERC20 decimals
  }
}
