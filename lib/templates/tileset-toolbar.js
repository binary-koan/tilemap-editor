'use babel';
import m from 'mithril';

export default function TilesetToolbar() {
  return m('div.toolbar', [
    m('div.btn-group', [
      m('button.btn.active', { type: 'button' }, 'Options'),
      m('button.btn', { type: 'button' }, 'Collision'),
      m('button.btn', { type: 'button' }, 'Terrain')
    ]),
    m('button.btn.pull-right', { type: 'button' }, 'Open in text editor')
  ]);
}
