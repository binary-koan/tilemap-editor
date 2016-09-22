'use babel';
import m from 'mithril';

import TextInput from '../components/text-input';
import { updateFile } from '../stores/tileset/actions';

function optionEditor(label, property, store) {
  return TextInput({
    label: label,
    value: store.getState().fileContent[property],
    onChange: value => store.updateFile({ [property]: value })
  })
}

export default function TilesetOptions({ store, visible }) {
  return m('div.content.options', { class: (visible ? '' : 'hidden') }, [
    optionEditor('Path to image', 'image', store),
    optionEditor('Tile width', 'tilewidth', store),
    optionEditor('Tile height', 'tileheight', store),
    optionEditor('Margin', 'margin', store),
    optionEditor('Spacing', 'spacing', store)
  ]);
}
