import { Item } from './item';

export interface EquippedItem {
  id: string;
  item_id: string;
  character_id: string;
  items?: Item;
}
