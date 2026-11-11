import type { UndevicePluginFlags } from 'undevice/fastify'
import type { undevicePlugin } from '../app.js'

type Flags = UndevicePluginFlags<typeof undevicePlugin>

declare module 'undevice/fastify' {
  interface UndeviceCustomFlags extends Flags {}
}
