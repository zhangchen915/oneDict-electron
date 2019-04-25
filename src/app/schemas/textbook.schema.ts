import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface TextbookDocumentType {
  word: string;
  state: number;
  updateTime: string;
}

export type TextbookDocument = RxDocument<TextbookDocumentType>;
export type TextbookCollection = RxCollection<TextbookDocumentType, {}>;

const schema: RxJsonSchema = {
  title: 'textbook schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    word: {
      type: 'string',
      default: ''
    },
    state: {
      type: 'number',
      default: -1
    },
    // updateTime: {
    //   type: 'string',
    //   default: ''
    // }
  },
  required: ['word', 'state']
};

export default schema;
