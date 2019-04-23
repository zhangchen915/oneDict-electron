import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface RecordDocumentType {
  textbookName: string;
  date: string;
  learn: number;
  complete: number;
  percentage: number;
}

export type RecordDocument = RxDocument<RecordDocumentType>;
export type RecordCollection = RxCollection<RecordDocumentType, {}>;

const schema: RxJsonSchema = {
  title: 'Record schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    textbookName: {
      type: 'string',
      primary: true,
    },
    date: {
      type: 'string',
    },
    learn: {
      type: 'number'
    },
    complete: {
      type: 'number',
      default: 0
    },
    percentage: {
      type: 'number',
      default: 0
    },
  },
  required: ['textbookName', 'date', 'learn']
};

export default schema;
