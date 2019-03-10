import {RxJsonSchema, RxDocument, RxCollection} from 'rxdb';

export interface FileDocumentType {
  name: string;
  path: string;
  describe: string;
  web: boolean;
  use: number;
}

// ORM methods
interface FileDocMethods {
  hpPercent(): number;
}

export type FileDocument = RxDocument<FileDocumentType, FileDocMethods>;
export type FileCollection = RxCollection<FileDocumentType, FileDocMethods, {}>;

const schema: RxJsonSchema = {
  title: 'file schema',
  description: '',
  version: 0,
  keyCompression: false,
  type: 'object',
  properties: {
    name: {
      type: 'string',
      primary: true,
      default: ''
    },
    path: {
      type: 'string',
      default: ''
    },
    describe: {
      type: 'string',
      default: ''
    },
    web: {
      type: 'boolean',
      default: false
    },
    use: {
      type: 'number',
      default: 0
    }
  },
  required: ['name', 'use']
};

export default schema;
