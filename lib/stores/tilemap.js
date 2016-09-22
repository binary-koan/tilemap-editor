'use babel';
import { createStore } from 'redux'

export default function createTilemapStore(fileContent = "") {
  if (fileContent) {
    fileContent = JSON.parse(fileContent);
  }

  return createStore({
    currentTab: 'tiles',
    currentLayer: null,
    pickedTiles: [],
    pickedObject: null,

    fileContent: fileContent || {
      version: "1",
      tilewidth: 32,
      tileheight: 32,
      width: 50,
      height: 50,
      orientation: "orthogonal",
      layers: [],
      tilesets: []
    },
    originalContent: fileContent
  });
}

// Tileset example
// tilesets: [
//   {
//     name: "Main",
//     firstgid: 1,
//     image: "./tiles.png",
//     imagewidth: 192,
//     imageheight: 192,
//     tilewidth: 32,
//     tileheight: 32,
//     margin: 0,
//     spacing: 0
//   }
// ]
//
// Layer example
// layers: [
//   {
//     name: "Terrain",
//     x: 0,
//     y: 0,
//     width: 50,
//     height: 50,
//     opacity: 1,
//     visible: true,
//     type: "tilelayer" | "objectgroup",
//     data: [...]
//   }
//   'Dirt': {
//     1: ",,,1",
//     3: ",1,1"
//   }
// }
