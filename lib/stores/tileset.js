'use babel';
import { createStore } from 'redux'

import actionHandler from './tileset/action-handler';
import { loadFile } from './tileset/actions';

export default function createTilesetStore(uri, fileContent = "") {
  const store = createStore(actionHandler);

  if (fileContent) {
    store.dispatch(loadFile(uri, JSON.parse(fileContent)));
  }

  return store;
}

// Collision example
// collision: [1, 13, 14, 15, 18]
//
// Terrain example
// terrain: {
//   'Dirt': {
//     1: ",,,1",
//     3: ",1,1"
//   }
// }
