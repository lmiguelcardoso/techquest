import { Dungeon } from './dungeon';

export interface UserProgress {
  id: string;
  user_id: string;
  dungeon_id: string;
}

export interface UserProgressWithDungeon extends UserProgress {
  dungeon: Dungeon;
}
