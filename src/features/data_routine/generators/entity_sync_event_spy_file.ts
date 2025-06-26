import { cap } from "../../../utils/text_work/text_util";

export const entity_sync_event_spy_file = (entityName: string) => {
  const entityCap = cap(entityName);
  
return `class: ${entityCap}SyncEvent
fields:
  type: SyncEventType
  ${entityName}: ${entityCap}?,  
  id: UuidValue?,
`;};