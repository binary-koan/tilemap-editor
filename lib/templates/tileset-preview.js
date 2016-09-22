'use babel';
import m from 'mithril';
import path from 'path';

function makeURI(store) {
  const previewPath = store.getState().previewPath;
  const filePathUri = encodeURI(previewPath.replace(/\\/g, '/')).replace(/#/g, '%23').replace(/\?/g, '%3F');

  return `${path.dirname(store.getState().uri)}/${filePathUri}`;
}

export default function TilesetPreview(store) {
  if (store.getState().previewPath) {
    return m('.sidebar.tileset-preview', m('img', { src: makeURI(store) }));
  } else {
    return m('.sidebar.tileset-preview.empty', m('p', 'No tileset image'));
  }
}
