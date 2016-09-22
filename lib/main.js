'use babel';
import TilemapEditor from './tilemap-editor';
import TilesetEditor from './tileset-editor';

export default {
  config: {
    tilemapFileExtension: {
      type: "string",
      default: ".tiled.json"
    },
    tilesetFileExtension: {
      type: "string",
      default: ".tileset.json"
    }
  },

  activate() {
    this.opener = atom.workspace.addOpener(uri => {
      const tilemapExt = atom.config.get("tilemap-editor.tilemapFileExtension").toLowerCase();
      const tilesetExt = atom.config.get("tilemap-editor.tilesetFileExtension").toLowerCase();

      if (uri.toLowerCase().endsWith(tilemapExt)) {
        return new TilemapEditor(uri);
      } else if (uri.toLowerCase().endsWith(tilesetExt)) {
        return new TilesetEditor(uri);
      }
    });
  },

  deactivate() {
    this.opener.dispose();
  }
};
