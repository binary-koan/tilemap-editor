'use babel';
import m from 'mithril';

import TextInput from '../components/text-input';
import TilesetPreview from './tileset-preview';
import { updateFile, startUpdatePreview } from '../stores/tileset/actions';

function optionEditor(label, property, store) {
  return TextInput({
    label: label,
    value: store.getState().fileContent[property],
    onChange: value => store.dispatch(updateFile({ [property]: value }))
  })
}

export default function TilesetOptions(store) {
  const hiddenClass = store.getState().currentTab === 'options' ? '' : 'hidden';

  return m('.main', { class: hiddenClass }, [
    m('div.content.options', [
      TextInput({
        label: 'Path to image',
        value: store.getState().fileContent.image,
        onChange: value => store.dispatch(updateFile({ image: value })),
        suffix: m('button.btn', { onclick: () => store.dispatch(startUpdatePreview()) }, 'Update')
      }),
      optionEditor('Tile width', 'tilewidth', store),
      optionEditor('Tile height', 'tileheight', store),
      optionEditor('Margin', 'margin', store),
      optionEditor('Spacing', 'spacing', store)
    ]),
    TilesetPreview(store)
  ]);
}
