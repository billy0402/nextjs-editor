import { ArchiveType, type Directory } from '@/models/archive';

export const fakeFiles: Directory = {
  id: '0',
  name: 'root',
  fullPath: '',
  type: ArchiveType.DIRECTORY,
  depth: 0,
  parentId: undefined,
  readOnly: false,
  dirs: [
    {
      id: 'H1rMWpafrq',
      name: 'helpers',
      fullPath: 'helpers',
      type: ArchiveType.DIRECTORY,
      depth: 1,
      parentId: '0',
      readOnly: false,
      dirs: [],
      files: [
        {
          id: 'Hkfgz-TpfS9',
          name: 'counter.js',
          fullPath: 'helpers/counter.js',
          type: ArchiveType.FILE,
          depth: 2,
          parentId: 'H1rMWpafrq',
          readOnly: false,
          content: `\
class Counter {
  constructor() {
    this.count = 0;
  }

  /** Increment the counter */
  increment() {
    this.count++;
  }

  /** Decrement the counter */
  decrement() {
    this.count--;
  }

  /** Get the current count */
  getCount() {
    return this.count;
  }
}

module.exports = Counter;
`,
        },
      ],
    },
  ],
  files: [
    {
      id: 'Sy4-zWppMr5',
      name: 'main.js',
      fullPath: 'main.js',
      type: ArchiveType.FILE,
      depth: 1,
      parentId: '0',
      readOnly: false,
      content: `\
const Counter = require('./helpers/counter');

const counter = new Counter();

console.log('start:', counter.getCount());
counter.increment();
counter.increment();
counter.increment();
counter.decrement();
console.log('end:', counter.getCount());
`,
    },
    {
      id: 'Sy4-zWppMr6',
      name: 'README.md',
      fullPath: 'README.md',
      type: ArchiveType.FILE,
      depth: 1,
      parentId: '0',
      readOnly: true,
      content: `\
This file is readonly.
`,
    },
  ],
};
