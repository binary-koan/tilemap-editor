'use babel';
import path from 'path';
import fs from 'fs-plus';
import { Emitter, File, CompositeDisposable, TextBuffer } from 'atom';
import isEqual from 'lodash/isEqual';

import TilesetEditorView from './tileset-editor-view';
import createTilesetStore from './stores/tileset';
import { saveFile } from './stores/tileset/actions';

export default class TilesetEditor {
  constructor(filePath) {
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();

    if (fs.isFileSync(filePath)) {
      const contents = fs.readFileSync(filePath, { encoding: 'utf-8' });

      this.buffer = new TextBuffer({ text: contents, filePath: filePath });
      this.store = createTilesetStore(this.buffer.getUri(), contents);
    } else {
      this.buffer = new TextBuffer({ text: this.formatContent(), filePath: filePath });
      this.store = createTilesetStore(this.buffer.getUri());
    }
  }

  serialize() {
    return { filePath: this.getPath(), deserializer: this.constructor.name };
  }

  terminatePendingState() {
    if (this.equalTo(atom.workspace.getActivePane().getPendingItem())) {
      this.emitter.emit('did-terminate-pending-state');
    }
  }

  onDidTerminatePendingState(callback) {
    return this.emitter.on('did-terminate-pending-state', callback);
  }

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }

  destroy() {
    this.subscriptions.dispose();
    this.emitter.emit('did-destroy');
  }

  // Document info

  getTitle() {
    if (this.getPath()) {
      return path.basename(this.getPath());
    } else {
      return "untitled";
    }
  }

  getURI() {
    return this.buffer.getUri();
  }

  getPath() {
    return this.buffer.getPath();
  }

  // Document state

  isModified() {
    return !isEqual(this.store.getState().fileContent, this.store.getState().originalContent);
  }

  isEmpty() {
    return false;
  }

  // File operations

  save() {
    this.syncBuffer();
    this.buffer.save();
    this.store.dispatch(saveFile(this.buffer.getUri()));
  }

  saveAs(filePath) {
    this.syncBuffer();
    this.buffer.saveAs(filePath);
    this.store.dispatch(saveFile(this.buffer.getUri()));
  }

  shouldPromptToSave() {
    return this.isModified();
  }

  // Utilities

  syncBuffer() {
    this.buffer.setText(this.formatContent());
  }

  formatContent() {
    return JSON.stringify(this.store.getState().fileContent, null, 2);
  }

  equalTo(other) {
    return other instanceof TilesetEditor && this.getURI() == other.getURI();
  }
}

TilesetEditor.deserialize = ({ filePath }) => {
  if (fs.isFileSync(filePath)) {
    new TilesetEditor(filePath);
  } else {
    console.warn(`Could not deserialize tileset editor for path '${filePath}' because the file no longer exists.`);
  }
};

atom.deserializers.add(TilesetEditor);

atom.views.addViewProvider(TilesetEditor, (editor) => {
  const view = new TilesetEditorView();
  view.initialize(editor);
  return view;
});
