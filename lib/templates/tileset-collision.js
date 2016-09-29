'use babel';
import m from 'mithril';
import TilesetPreview from './tileset-preview';

export default function TilesetCollision(store) {
  const hiddenClass = store.getState().currentTab === 'collision' ? '' : 'hidden';

  return m('.main', { class: hiddenClass }, [
    m('.content.collision', [
      m('p', 'Use the preview on the right to set collision data for the tileset.')
    ]),
    TilesetPreview(store)
  ]);
}
