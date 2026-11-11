import type { FastifyPluginAsync } from 'fastify'
import { ROUTES } from '../constants.js'

export const healthRouter: FastifyPluginAsync = async app => {
  app.get(ROUTES.health, async () => {
    return { status: 'ok' }
  })
}
