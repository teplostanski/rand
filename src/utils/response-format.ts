import { FORMATS } from '../constants.js'

export const responseFormat = (query: object) => {
  if (Object.hasOwn(query, FORMATS.prettyJson)) {
    return FORMATS.prettyJson
  }

  if (Object.hasOwn(query, FORMATS.json)) {
    return FORMATS.json
  }

  return FORMATS.plainText
}
