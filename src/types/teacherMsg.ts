export interface Teacher {
  id: string;

  name: string;

  photo: string;

  recentMessage: {
    content: string;

    timestamp: string;
  };

  newMessagesCount: number;
}
