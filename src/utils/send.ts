import type { FastifyReply } from 'fastify'
import { FORMATS } from '../constants.js'

type ResponseFormat = (typeof FORMATS)[keyof typeof FORMATS]

export const send = (reply: FastifyReply, format: ResponseFormat, data: unknown, text: string) => {
  if (format === FORMATS.json || format === FORMATS.prettyJson) {
    const spaces = format === FORMATS.prettyJson ? 2 : undefined

    return reply.type('application/json; charset=utf-8').send(JSON.stringify(data, null, spaces))
  }

  return reply.type('text/plain; charset=utf-8').send(text)
}
