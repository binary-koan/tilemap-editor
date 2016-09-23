'use babel';
import m from 'mithril';

export default function TilesetCollision(store) {
  const hiddenClass = store.getState().currentTab === 'collision' ? '' : 'hidden';

  return m('div.content.collision', { class: hiddenClass }, [
    m('h1', 'Collision')
  ]);
}
