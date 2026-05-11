import { authHandlers } from './auth'
import { dashboardHandlers } from './dashboard'
import { knowledgeHandlers } from './knowledge'
import { rankingHandlers } from './ranking'
import { partyHandlers } from './party'
import { systemHandlers } from './system'

export const handlers = [
  ...authHandlers,
  ...dashboardHandlers,
  ...knowledgeHandlers,
  ...rankingHandlers,
  ...partyHandlers,
  ...systemHandlers,
]
