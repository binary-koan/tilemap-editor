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
  ADD_TERRAIN,
  RENAME_TERRAIN,
  MARK_TERRAIN
} from './actions';

const initialState = {
  uri: null,
  currentTab: 'options',
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
    terrain: {}
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
  case ADD_TERRAIN:
    return addTerrain(state);
  case RENAME_TERRAIN:
    return renameTerrain(state, action.oldName, action.newName);
  case MARK_TERRAIN:
    return markTerrain(state, action.name, action.tiles);
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

  return merge({}, state, { terrain: { [name]: {} } });
}

function generateTerrainName(state) {
  const nameGen = number => `Untitled ${number}`;
  let number = 1;

  do {
    name = nameGen(number);
    number++;
  } while (state.fileContent.terrain[name]);
}

function hasTerrain(name, state) {
  return state.fileContent.terrain[name];
}

function renameTerrain(state, oldName, newName) {
  if (hasTerrain(state, newName)) {
    return Object.assign({}, state, { error: `Terrain already exists with name: ${newName}` });
  }

  const newTerrain = Object.assign({}, state.fileContent.terrain);
  newTerrain[newName] = newTerrain[oldName];
  delete newTerrain[oldName];

  return Object.assign({}, state, {
    fileContent: Object.assign({}, state.fileContent, { terrain: newTerrain })
  });
}

function markTerrain(state, name, tiles) {
  return merge({}, state, {
    fileContent: { terrain: { [name]: tiles } }
  });
}
