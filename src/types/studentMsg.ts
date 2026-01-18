// export interface Student {
//   id: string;

//   name: string;

//   photo: string;

//   recentMessage: {
//     timestamp: string;
//   };
// }

export interface Student {
  id: string;

  name: string;

  photo: string;

  recentMessage: {
    content: string;

    timestamp: string;
  };

  newMessagesCount: number;
}
