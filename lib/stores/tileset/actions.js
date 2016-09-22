'use babel';

export const LOAD_FILE = 'load_file';
export const SAVE_FILE = 'save_file';
export const SWITCH_TABS = 'switch_tabs';
export const UPDATE_PREVIEW = 'update_preview';

// Generic file update action for when no complex handling is needed
export const UPDATE_FILE = 'update_file';

// More specific update actions for terrain, since that's exactly when complex handling is needed
export const ADD_TERRAIN = 'add_terrain';
export const RENAME_TERRAIN = 'rename_terrain';
export const MARK_TERRAIN = 'mark_terrain';

export function loadFile(uri, fileContent) {
  return { type: LOAD_FILE, uri, fileContent };
}

export function saveFile(uri) {
  return { type: SAVE_FILE, uri };
}

export function switchTabs(tab) {
  return { type: SWITCH_TABS, tab };
}

export function updatePreview() {
  return { type: UPDATE_PREVIEW };
}

export function updateFile(properties) {
  return { type: UPDATE_FILE, properties };
}

export function addTerrain() {
  return { type: ADD_TERRAIN };
}

export function renameTerrain(oldName, newName) {
  return { type: ADD_TERRAIN, oldName, newName };
}

export function markTerrain(name, tiles) {
  return { type: MARK_TERRAIN, name, tiles };
}
