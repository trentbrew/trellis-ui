export type { TrellisClientConfig, EntityConfig, QueryConfig, PresenceConfig } from './types.js'

export { TrellisProvider } from './provider.js'
export { getTrellisClient } from './context.js'
export { TrellisEntity } from './entity.js'
export { TrellisEntityList } from './entity-list.js'
export { TrellisQuery } from './query.js'
export { resolveShell } from './shells.js'

export type { TrellisEditorExport } from './editor/trellis-editor.js'
export { TrellisEditor } from './editor/trellis-editor.js'

import './provider.js'
import './entity.js'
import './entity-list.js'
import './query.js'
