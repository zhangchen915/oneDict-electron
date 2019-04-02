import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface GlossaryDocumentType {
  word: string;
  definition: string;
  addTime: string;
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
    definition: {
      type: 'string',
      default: ''
    },
    addTime: {
      type: 'string',
      default: ''
    }
  },
  required: ['word', 'definition', 'addTime']
};

export default schema;
