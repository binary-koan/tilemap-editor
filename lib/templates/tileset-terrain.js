'use babel';
import m from 'mithril';

import { selectTerrain, addTerrain, startRenameTerrain, finishRenameTerrain } from '../stores/tileset/actions';
import TextInput from '../components/text-input';
import TilesetPreview from './tileset-preview';

function TerrainListItem(terrain, store) {
  let activeClass = '';
  let content = m('a', { href: '#', onclick: () => store.dispatch(selectTerrain(terrain.index)) }, terrain.name);

  if (store.getState().selectedTerrain === terrain.index) {
    activeClass = 'active';

    if (store.getState().renamingTerrain) {
      const finishRenaming = e => store.dispatch(finishRenameTerrain(e.target.value));

      content = TextInput({ value: terrain.name, onChange: finishRenaming })

      content = m('input[type=text].native-key-bindings', {
        value: terrain.name,
        onchange: finishRenaming,
        onkeypress: e => e.keyCode === 13 ? finishRenaming(e) : m.redraw.strategy('none') // Allow confirming using enter key
      });
    }
  }

  return m('li', { class: activeClass }, content);
}

export default function TilesetTerrain(store) {
  const hiddenClass = store.getState().currentTab === 'terrain' ? '' : 'hidden';
  const sortedTerrains = store.getState().fileContent.terrain
    .map((terrain, i) => ({ ...terrain, index: i }))
    .sort((a, b) => a.name.localeCompare(b.name));

  return m('.main', { class: hiddenClass }, [
    m('.content.terrain', [
      m('ul.terrain-list', sortedTerrains.map(terrain => TerrainListItem(terrain, store))),
      m('.terrain-toolbar', [
        m('button[type=button].btn.icon.icon-plus', { onclick: () => store.dispatch(addTerrain()) }, 'Add'),
        m('.btn-group.pull-right', [
          m('button[type=button].btn.icon.icon-pencil', { onclick: () => store.dispatch(startRenameTerrain()) }, 'Rename'),
          m('button[type=button].btn.icon.icon-trashcan', 'Delete')
        ])
      ])
    ]),
    TilesetPreview({ store: store })
  ]);
}
