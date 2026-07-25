export interface TrellisClientConfig {
  url: string
  apiKey?: string
  tenantId?: string
}

export interface EntityConfig {
  id: string
  type: string
  vantage?: number
  lane?: string
  editable?: boolean
}

export interface QueryConfig {
  tql: string
}

export interface PresenceConfig {
  room: string
  transport?: 'broadcast' | 'websocket' | 'memory'
}
