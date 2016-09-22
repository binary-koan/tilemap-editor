'use babel';
import m from 'mithril';
import path from 'path';
import range from 'lodash/range';
import { finishUpdatePreview } from '../stores/tileset/actions';

function makePreviewURI(store) {
  const previewPath = store.getState().preview.path;
  const filePathUri = encodeURI(previewPath.replace(/\\/g, '/')).replace(/#/g, '%23').replace(/\?/g, '%3F');

  return `${path.dirname(store.getState().uri)}/${filePathUri}`;
}

function loadPreviewImage(store) {
  const image = new Image();
  image.onload = () => store.dispatch(finishUpdatePreview(image.naturalWidth, image.naturalHeight));
  image.src = makePreviewURI(store);
}

//TODO support margin and spacing
function TilePreview({ x, y, tileWidth, tileHeight, imageURI }) {
  return m('td.tile', {
    class: 'static-preview',
    style: `
      background-image: url(${imageURI});
      background-position: -${x * tileWidth}px -${y * tileHeight}px;
      width: ${tileWidth}px;
      height: ${tileHeight}px;
    `
  });
}

export default function TilesetPreview(store) {
  const preview = store.getState().preview;
  if (preview.path && (!preview.width || !preview.height)) {
    loadPreviewImage(store);
  }

  if (preview.path && preview.width && preview.height) {
    const tileWidth = store.getState().fileContent.tilewidth;
    const tileHeight = store.getState().fileContent.tileheight;
    const tilesWide = Math.ceil(preview.width / tileWidth);
    const tilesHigh = Math.ceil(preview.height / tileHeight);
    const imageURI = makePreviewURI(store);

    return m('.sidebar.tileset-preview',
      m('table', m('tbody',
        range(tilesHigh).map(y =>
          m('tr', range(tilesWide).map(x => TilePreview({ x, y, tileWidth, tileHeight, imageURI })))
        )
      ))
    );

    // return m('.sidebar.tileset-preview', m('img', { src: makeURI(store) }));
    // return m('.sidebar.tileset-preview.empty', m('p', `${preview.width}x${preview.height}`));
  } else {
    return m('.sidebar.tileset-preview.empty', m('p', 'No tileset image'));
  }
}
