import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface GlossaryDocumentType {
  word: string;
  searchTime: string;
}

export type GlossaryDocument = RxDocument<GlossaryDocumentType>;
export type GlossaryCollection = RxCollection<GlossaryDocumentType, {}>;

const schema: RxJsonSchema = {
  title: 'glossary schema',
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
    addTime: {
      type: 'string',
      default: ''
    }
  },
  required: ['word', 'addTime']
};

export default schema;
