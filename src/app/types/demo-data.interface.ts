export interface DemoMessage {
  sender_name: string;
  timestamp: number;
  type: string;
  sent: boolean;
  media: string;
  message: string;
  length: number;

  is_still_participant: boolean;
  thread_type: string;
  thread: string;
  nb_participants: number;
  time: string;
  date: string;
}

export interface DemoData {
  messages_array: Array<DemoMessage>;
}
