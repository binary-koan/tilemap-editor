'use babel';
import m from 'mithril';

import { selectTerrain, addTerrain } from '../stores/tileset/actions';
import TilesetPreview from './tileset-preview';

export default function TilesetTerrain(store) {
  const hiddenClass = store.getState().currentTab === 'terrain' ? '' : 'hidden';
  const sortedTerrains = store.getState().fileContent.terrain.sort((a, b) => a.name.localeCompare(b.name));

  function doSelectTerrain(index, e) {
    e.preventDefault();

    store.dispatch(selectTerrain(index));
  }

  return m('.main', { class: hiddenClass }, [
    m('.content.terrain', [
      m('ul.terrain-list', sortedTerrains.map((terrain, i) =>
        m('li',
          { class: i === store.getState().selectedTerrain ? 'active' : '' },
          m('a', { href: '#', onclick: doSelectTerrain.bind(null, i) }, terrain.name)
        )
      )),
      m('.terrain-toolbar', [
        m('button[type=button].btn.icon.icon-plus', { onclick: store.dispatch.bind(store, addTerrain()) }, 'Add'),
        m('.btn-group.pull-right', [
          m('button[type=button].btn.icon.icon-pencil', 'Rename'),
          m('button[type=button].btn.icon.icon-trashcan', 'Delete')
        ])
      ])
    ]),
    TilesetPreview({ store: store })
  ]);
}
