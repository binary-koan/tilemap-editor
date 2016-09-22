'use babel';
import m from 'mithril';

export default function TilesetOptions({ visible }) {
  return m('div.content.collision', { class: (visible ? '' : 'hidden') }, [
  ]);
}
