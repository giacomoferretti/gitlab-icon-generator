export type ResvgWorkerMessage = {
  svg: string;
  width: number;
  _id: number;
};

export type ResvgWorkerMessageResult = {
  _id: number;
  url: string;
};
