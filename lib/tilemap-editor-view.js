'use babel';
import { Emitter, CompositeDisposable } from 'atom';

import { createProjector, m } from "mithril";

class TilemapEditorView extends HTMLDivElement {
  initialize(editor) {
    this.editor = editor;

    this.classList.add("tile-editor", "tilemap-editor", "pane-item");

    this.projector = createProjector();
    this.projector.append(this, this.render.bind(this));
  }

  render() {
    return m('div', [
      m('div.toolbar', [
        m('div.btn-group', [
          m('button.btn.active', { type: 'button' }, "Tiles"),
          m('button.btn', { type: 'button' }, "Objects")
        ]),
        m('div.btn-group', [
          m('button.btn', { type: 'button' }, "Stamp")
        ]),
        m('button.btn.pull-right', { type: 'button' }, "Open in text editor")
      ]),
      m('div.main', [
        m('div.sidebar'),
        m('div.content')
      ])
    ]);
  }
}

export default document.registerElement("tilemap-editor-view", { prototype: TilemapEditorView.prototype });
