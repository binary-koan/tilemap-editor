'use babel';
import m from 'mithril';
import { switchTabs } from '../stores/tileset/actions';

function Tab(id, title, store) {
  const activeClass = store.getState().currentTab === id ? 'active' : null;

  return m('button.btn', {
    type: 'button',
    class: activeClass,
    onclick: () => store.dispatch(switchTabs(id))
  }, title);
}

export default function TilesetToolbar(store) {
  return m('div.toolbar', [
    m('div.btn-group', [
      Tab('options', 'Options', store),
      Tab('collision', 'Collision', store),
      Tab('terrain', 'Terrain', store)
    ]),
    m('button.btn.pull-right', { type: 'button' }, 'Open in text editor')
  ]);
}
