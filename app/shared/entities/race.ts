export interface Race {
  race_id: number;
  name: string;
  role: string;
  icon: string;
  color: string;
  'background-image': string;
  description: {
    title: string;
    subtitle: string;
    description: string;
  };
}
