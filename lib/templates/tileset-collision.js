'use babel';
import m from 'mithril';
import range from 'lodash/range';

import TilesetPreview from './tileset-preview';
import { updateFile } from '../stores/tileset/actions';

const COLLISION_OPTIONS = [0, 1, 2, 3];

function nextCollisionOption(current) {
  const index = COLLISION_OPTIONS.indexOf(current);

  return COLLISION_OPTIONS[index + 1] || COLLISION_OPTIONS[0];
}

function TileCollision({ x, y, store, scale, tileWidth, tileHeight, imageWidth, imageHeight }) {
  const tilesWide = Math.ceil(imageWidth / tileWidth);
  const tilesHigh = Math.ceil(imageHeight / tileHeight);
  const collisionData = store.getState().fileContent.collision;

  const currentCollision = collisionData[y * tilesWide + x] || COLLISION_OPTIONS[0];

  function updateCollisionData() {
    const newData = range(tilesWide * tilesHigh).map((_, i) => collisionData[i] || COLLISION_OPTIONS[0]);
    newData[y * tilesWide + x] = nextCollisionOption(currentCollision);

    store.dispatch(updateFile({ collision: newData }));
  }

  return m('.collision', {
    class: `collision-option-${currentCollision}`,
    style: `font-size: ${tileHeight * scale / 2}px`,
    onclick: updateCollisionData
  }, currentCollision.toString());
}

export default function TilesetCollision(store) {
  const hiddenClass = store.getState().currentTab === 'collision' ? '' : 'hidden';

  return m('.main', { class: hiddenClass }, [
    m('.content.collision', [
      m('p', 'Use the preview on the right to set collision data for the tileset.')
    ]),
    TilesetPreview({ store: store, tileOverlay: TileCollision })
  ]);
}
