'use babel';
import m from 'mithril';

export default function TilesetTerrain({ visible }) {
  return m('div.content.terrain', { class: (visible ? '' : 'hidden') }, [
  ]);
}
