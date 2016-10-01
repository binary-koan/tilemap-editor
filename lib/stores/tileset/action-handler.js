'use babel';
import merge from 'lodash/merge';
import cloneDeep from 'lodash/cloneDeep';

import {
  LOAD_FILE,
  SAVE_FILE,
  SWITCH_TABS,
  UPDATE_PREVIEW,
  UPDATE_PREVIEW_FINISH,
  ZOOM_IN,
  ZOOM_OUT,
  UPDATE_FILE,
  SELECT_TERRAIN,
  ADD_TERRAIN,
  START_RENAME_TERRAIN,
  FINISH_RENAME_TERRAIN,
  MARK_TERRAIN
} from './actions';

const initialState = {
  uri: null,
  currentTab: 'options',
  selectedTerrain: 0,
  renamingTerrain: false,
  preview: {
    scale: 1
  },
  fileContent: {
    name: "Main",
    image: null,
    imagewidth: 192,
    imageheight: 192,
    tilewidth: 32,
    tileheight: 32,
    margin: 0,
    spacing: 0,
    collision: [],
    terrain: []
  },
  originalContent: null
};

const scaleLevels = [0.25, 0.5, 1, 2, 4];

function ensureCorrectTypes(properties) {
  if (properties.imagewidth) {
    properties.imagewidth = parseInt(properties.imagewidth);
  }
  if (properties.imageheight) {
    properties.imageheight = parseInt(properties.imageheight);
  }
  if (properties.margin) {
    properties.margin = parseInt(properties.margin);
  }
  if (properties.spacing) {
    properties.spacing = parseInt(properties.spacing);
  }

  return properties;
}

export default function actionHandler(state = initialState, action) {
  switch (action.type) {
  case LOAD_FILE:
    return Object.assign({}, state, {
      uri: action.uri,
      fileContent: action.fileContent,
      originalContent: cloneDeep(action.fileContent)
    });
  case SAVE_FILE:
    return Object.assign({}, state, {
      uri: action.uri,
      preview: { ...state.preview, path: state.fileContent.image },
      originalContent: cloneDeep(state.fileContent)
    });
  case SWITCH_TABS:
    return Object.assign({}, state, { currentTab: action.tab });
  case UPDATE_PREVIEW:
    return merge({}, state, { preview: { path: state.fileContent.image, width: null, height: null } });
  case UPDATE_PREVIEW_FINISH:
    return merge({}, state, { preview: { width: action.imageWidth, height: action.imageHeight } });
  case ZOOM_IN:
    return zoomIn(state);
  case ZOOM_OUT:
    return zoomOut(state);
  case UPDATE_FILE:
    return merge({}, state, { fileContent: ensureCorrectTypes(action.properties) });
  case SELECT_TERRAIN:
    return { ...state, selectedTerrain: action.index };
  case ADD_TERRAIN:
    return addTerrain(state);
  case START_RENAME_TERRAIN:
    return { ...state, renamingTerrain: true };
  case FINISH_RENAME_TERRAIN:
    return renameTerrain(state, action.newName);
  case MARK_TERRAIN:
    return markTerrain(state, action.tiles);
  default:
    return state;
  }
}

function zoomIn(state) {
  const currentIndex = scaleLevels.indexOf(state.preview.scale);

  if (currentIndex < (scaleLevels.length - 1)) {
    return merge({}, state, { preview: { scale: scaleLevels[currentIndex + 1] } });
  } else {
    return state;
  }
}

function zoomOut(state) {
  const currentIndex = scaleLevels.indexOf(state.preview.scale);

  if (currentIndex > 0) {
    return merge({}, state, { preview: { scale: scaleLevels[currentIndex - 1] } });
  } else {
    return state;
  }
}

function addTerrain(state) {
  const name = hasTerrain('Untitled', state) ? generateTerrainName(state) : 'Untitled';
  const newTerrain = state.fileContent.terrain.concat([{ name: name, tiles: {}}]);

  return { ...state, fileContent: { ...state.fileContent, terrain: newTerrain } };
}

function generateTerrainName(state) {
  const nameGen = number => `Untitled ${number}`;
  let number = 1;

  do {
    name = nameGen(number);
    number++;
  } while (hasTerrain(name, state));
}

function hasTerrain(name, state) {
  return state.fileContent.terrain.includes(terrain => terrain.name === name);
}

function renameTerrain(state, newName) {
  const newTerrain = state.fileContent.terrain.map((terrain, i) =>
    i === state.selectedTerrain ? { ...terrain, name: newName } : terrain
  );

  return { ...state, renamingTerrain: false, fileContent: { ...state.fileContent, terrain: newTerrain } };
}

function markTerrain(state, tiles) {
  const newTerrain = state.terrain.map((terrain, i) =>
    i === state.selectedTerrain ? { ...terrain, tiles } : terrain
  );

  return { ...state, fileContent: { ...state.fileContent, terrain: newTerrain } };
}
