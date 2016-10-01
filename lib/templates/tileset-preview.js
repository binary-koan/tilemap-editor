'use babel';
import m from 'mithril';
import path from 'path';
import range from 'lodash/range';
import { finishUpdatePreview, zoomIn, zoomOut } from '../stores/tileset/actions';

function fixPath(path) {
  return path.replace(/\\/g, '/');
}

function makePreviewURI(store) {
  const previewPath = store.getState().preview.path;
  const filePathUri = encodeURI(fixPath(previewPath)).replace(/#/g, '%23').replace(/\?/g, '%3F');

  return `${fixPath(path.dirname(store.getState().uri))}/${filePathUri}`;
}

function loadPreviewImage(store) {
  const image = new Image();
  image.onload = () => store.dispatch(finishUpdatePreview(image.naturalWidth, image.naturalHeight));
  image.src = makePreviewURI(store);
}

//TODO support margin and spacing
function TilePreview(options) {
  const { x, y, imageWidth, imageHeight, tileWidth, tileHeight, scale, imageURI } = options;
  const overlay = options.overlay ? options.overlay(options) : "";

  return m('.tile', {
    style: `
      background-image: url(${imageURI});
      background-position: -${x * tileWidth * scale}px -${y * tileHeight * scale}px;
      background-size: ${imageWidth * scale}px ${imageHeight * scale}px;
      width: ${tileWidth * scale}px;
      height: ${tileHeight * scale}px;
    `
  }, overlay);
}

export default function TilesetPreview({ store, tileOverlay }) {
  const preview = store.getState().preview;
  if (preview.path && (!preview.width || !preview.height)) {
    loadPreviewImage(store);
  }

  if (preview.path && preview.width && preview.height) {
    const tileOptions = {
      imageWidth: preview.width,
      imageHeight: preview.height,
      tileWidth: store.getState().fileContent.tilewidth,
      tileHeight: store.getState().fileContent.tileheight,
      scale: store.getState().preview.scale,
      imageURI: makePreviewURI(store),
      store: store,
      overlay: tileOverlay
    };
    const tilesWide = Math.ceil(preview.width / tileOptions.tileWidth);
    const tilesHigh = Math.ceil(preview.height / tileOptions.tileHeight);

    return m('.sidebar.tileset-preview', [
      m('.scroll-container',
        m('.tileset', {
          style: `
            width: ${tileOptions.imageWidth * tileOptions.scale}px;
            height: ${tileOptions.imageHeight * tileOptions.scale}px;
          `
        }, range(tilesHigh).map(y =>
          m('.tile-row', range(tilesWide).map(x => TilePreview({ x, y, ...tileOptions })))
        ))
      ),
      m('.toolbar', [
        m('button.btn', { onclick: () => store.dispatch(zoomOut()) }, '-'),
        m('span', (store.getState().preview.scale * 100) + '%'),
        m('button.btn', { onclick: () => store.dispatch(zoomIn()) }, '+')
      ])
    ]);
  } else {
    return m('.sidebar.tileset-preview.empty', m('p', 'No tileset image'));
  }
}
