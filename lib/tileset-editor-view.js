'use babel';
import { Emitter, CompositeDisposable } from 'atom';
import m from 'mithril';

import Toolbar from './templates/tileset-toolbar';
import Options from './templates/tileset-options';
import Collision from './templates/tileset-collision';
import Terrain from './templates/tileset-terrain';

class TilesetEditorView extends HTMLDivElement {
  initialize(editor) {
    this.classList.add('tile-editor', 'tileset-editor', 'pane-item');

    this.editor = editor;
    this.editor.onDidDestroy(this.destroy.bind(this));

    m.mount(this, { view: this.render.bind(this) });
    this.unsubscribe = this.editor.store.subscribe(m.redraw.bind(m));
  }

  render() {
    const store = this.editor.store;

    return m('div', [
      Toolbar(store),
      Options(store),
      Collision(store),
      Terrain(store)
    ]);
  }

  destroy() {
    m.mount(this, null);
    this.unsubscribe();
  }
}

export default document.registerElement('tileset-editor-view', { prototype: TilesetEditorView.prototype });
