'use babel';
import path from "path";
import fs from "fs-plus";
import { Emitter, File, CompositeDisposable } from "atom";

import TilemapEditorView from "./tilemap-editor-view";

export default class TilemapEditor {
  constructor(filePath) {
    this.file = new File(filePath);
    this.uri = `file://${encodeURI(filePath.replace(/\\/g, '/')).replace(/#/g, '%23').replace(/\?/g, '%3F')}`;
    this.subscriptions = new CompositeDisposable();
    this.emitter = new Emitter();
  }

  serialize() {
    return { filePath: this.getPath(), deserializer: this.constructor.name };
  }

  terminatePendingState() {
    if (this.isEqual(atom.workspace.getActivePane().getPendingItem())) {
      this.emitter.emit('did-terminate-pending-state');
    }
  }

  onDidTerminatePendingState(callback) {
    return this.emitter.on('did-terminate-pending-state', callback);
  }

  // Register a callback for when the tilemap file changes
  onDidChange (callback) {
    const changeSubscription = this.file.onDidChange(callback);
    this.subscriptions.add(changeSubscription);
    return changeSubscription;
  }

  // Register a callback for when the tilemap's title changes
  onDidChangeTitle (callback) {
    const renameSubscription = this.file.onDidRename(callback);
    this.subscriptions.add(renameSubscription);
    return renameSubscription;
  }

  destroy() {
    this.subscriptions.dispose();
  }

  getTitle() {
    if (this.getPath()) {
      return path.basename(this.getPath());
    } else {
      return "untitled";
    }
  }

  getURI() {
    return this.uri;
  }

  getPath() {
    return this.file.getPath();
  }

  isEqual(other) {
    return other instanceof TilemapEditor && this.getURI() == other.getURI();
  }

  onDidDestroy(callback) {
    return this.emitter.on('did-destroy', callback);
  }
}

TilemapEditor.deserialize = ({ filePath }) => {
  if (fs.isFileSync(filePath)) {
    new TilemapEditor(filePath);
  } else {
    console.warn(`Could not deserialize tilemap editor for path '${filePath}' because the file no longer exists.`);
  }
};

atom.deserializers.add(TilemapEditor);

atom.views.addViewProvider(TilemapEditor, (editor) => {
  const view = new TilemapEditorView();
  view.initialize(editor);
  return view;
});
