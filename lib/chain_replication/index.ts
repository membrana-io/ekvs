import { Message } from './remote';

export enum RequestType {
  Update, Query
}

export interface Request {
  id: string;
  type: RequestType;
  key: string;
  value: string|Buffer|undefined;
}

export interface Response {
  id: string;
  key: string;
  value: string|Buffer|undefined;
}
export interface UpdateRequest extends Request {
  type: RequestType.Update;
  value: string|Buffer;
}
export interface QueryRequest extends Request {
  type: RequestType.Query;
}

export interface IQueryInterface {
  on(event: 'message', listener: (this: IQueryInterface, message: Message) => void): this;
  onResponse(response: Response): void;
}
