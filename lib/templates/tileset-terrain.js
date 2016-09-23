'use babel';
import m from 'mithril';

export default function TilesetTerrain(store) {
  const hiddenClass = store.getState().currentTab === 'terrain' ? '' : 'hidden';

  return m('div.content.terrain', { class: hiddenClass }, [
  ]);
}
