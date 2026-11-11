import type { FastifyReply } from 'fastify'

export const sendError = (reply: FastifyReply, status: number, message: string) => {
  return reply.code(status).type('text/plain; charset=utf-8').send(message)
}
