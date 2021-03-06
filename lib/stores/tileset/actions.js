'use babel';
import mapValues from 'lodash/mapValues';

export const LOAD_FILE = 'load_file';
export const SAVE_FILE = 'save_file';
export const SWITCH_TABS = 'switch_tabs';
export const UPDATE_PREVIEW = 'update_preview';
export const UPDATE_PREVIEW_FINISH = 'update_preview_finish';

export const ZOOM_IN = 'zoom_in';
export const ZOOM_OUT = 'zoom_out';

// Generic file update action for when no complex handling is needed
export const UPDATE_FILE = 'update_file';

// More specific update actions for terrain, since that's exactly when complex handling is needed
export const SELECT_TERRAIN = 'select_terrain';
export const ADD_TERRAIN = 'add_terrain';
export const START_RENAME_TERRAIN = 'start_rename_terrain';
export const FINISH_RENAME_TERRAIN = 'finish_rename_terrain';
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

export function startUpdatePreview() {
  return { type: UPDATE_PREVIEW };
}

export function finishUpdatePreview(imageWidth, imageHeight) {
  return { type: UPDATE_PREVIEW_FINISH, imageWidth, imageHeight };
}

export function zoomIn() {
  return { type: ZOOM_IN };
}

export function zoomOut() {
  return { type: ZOOM_OUT };
}

const INTEGER_PROPERTIES = ['tilewidth', 'tileheight', 'margin', 'spacing'];

export function updateFile(properties) {
  properties = mapValues(properties, (val, key) =>
    INTEGER_PROPERTIES.includes(key) ? parseInt(val) : val
  );

  return { type: UPDATE_FILE, properties };
}

export function selectTerrain(index) {
  return { type: SELECT_TERRAIN, index };
}

export function addTerrain() {
  return { type: ADD_TERRAIN };
}

export function startRenameTerrain() {
  return { type: START_RENAME_TERRAIN };
}

export function finishRenameTerrain(newName) {
  return { type: FINISH_RENAME_TERRAIN, newName };
}

export function markTerrain(tiles) {
  return { type: MARK_TERRAIN, tiles };
}
