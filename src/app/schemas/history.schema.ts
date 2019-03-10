import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface HistoryDocumentType {
  word: string;
  searchTime: string;
}

export type HistoryDocument = RxDocument<HistoryDocumentType>;
export type HistoryCollection = RxCollection<HistoryDocumentType, {}>;

const schema: RxJsonSchema = {
  title: 'history schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    word: {
      type: 'string',
      primary: true,
      default: ''
    },
    searchTime: {
      type: 'string',
      default: ''
    }
  },
  required: ['word', 'searchTime']
};

export default schema;
