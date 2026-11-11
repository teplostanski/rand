export type LengthOptions = {
  param: 'byteLength' | 'nanoidLength'
  defaultValue: number
  max: number
}

export const validateLength = (
  value: string | undefined,
  options: LengthOptions,
): number | undefined => {
  const length = Number(value ?? options.defaultValue)

  if (!Number.isSafeInteger(length) || length <= 0 || length > options.max) {
    return undefined
  }

  return length
}
