export interface Topic {
  id: string;
  name: string;
  dungeon_id: string;
  description: string;
  enemy: {
    name: string;
    image: string;
  };
}

export interface TopicWithUserStatus extends Topic {
  completed: boolean;
  status: string;
}
