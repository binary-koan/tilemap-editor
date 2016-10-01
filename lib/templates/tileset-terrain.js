'use babel';
import m from 'mithril';

import { selectTerrain, addTerrain } from '../stores/tileset/actions';
import TilesetPreview from './tileset-preview';

export default function TilesetTerrain(store) {
  const hiddenClass = store.getState().currentTab === 'terrain' ? '' : 'hidden';

  function doSelectTerrain(index, e) {
    e.preventDefault();

    store.dispatch(selectTerrain(index));
  }

  return m('.main', { class: hiddenClass }, [
    m('.content.terrain', [
      m('ul.terrain-list', store.getState().fileContent.terrain.map((terrain, i) =>
        m('li',
          { class: i === store.getState().selectedTerrain ? 'active' : '' },
          m('a', { href: '#', onclick: doSelectTerrain.bind(null, i) }, terrain.name)
        )
      )),
      m('.terrain-toolbar', [
        m('button[type=button].btn', { onclick: store.dispatch.bind(store, addTerrain()) }, 'Add'),
        m('button[type=button].btn', 'Delete')
      ])
    ]),
    TilesetPreview({ store: store })
  ]);
}
