import {installCustomBlocks} from '@cdo/apps/block_utils';
import {PROCEDURE_BLOCK_TYPES} from '@cdo/apps/blockly/constants';
import commonBlocks from '@cdo/apps/blocksCommon';
import assetUrl from '@cdo/apps/code-studio/assetUrl';
import {getStore} from '@cdo/apps/code-studio/redux';
import {installFunctionBlocks} from '@cdo/apps/music/blockly/blockUtils';
import {setUpBlocklyForMusicLab} from '@cdo/apps/music/blockly/setup';
import animationList, {
  setInitialAnimationList,
} from '@cdo/apps/p5lab/redux/animationList';
import {
  customInputTypes,
  install as installSpriteLabBlocks,
} from '@cdo/apps/p5lab/spritelab/blocks';
import {
  valueTypeTabShapeMap,
  exampleSprites,
} from '@cdo/apps/p5lab/spritelab/constants';
import {registerReducers} from '@cdo/apps/redux';
import skinBase from '@cdo/apps/skins';
import {parseElement} from '@cdo/apps/xml';

import {
  convertXmlToBlockly,
  shrinkBlockSpaceContainer,
} from '../instructions/utils';

/**
 * Prepares the blockly environment to allow for embedding blocks in divs
 * Note that this function dispatches to redux
 *
 * @param {object[]} list of blocks that can be embedded
 */
export const prepareBlocklyForEmbedding = function (
  customBlocksConfig,
  programmingEnvironmentName
) {
  if (['spritelab', 'music'].includes(programmingEnvironmentName)) {
    // Shareable procedures blocks are used in both Sprite Lab and Music Lab.
    installFunctionBlocks();
    if (programmingEnvironmentName === 'spritelab') {
      installSpriteLabBlocks(Blockly);
    }
    if (programmingEnvironmentName === 'music') {
      // Music Lab does not use block pools, so we need to install blocks in a different way.
      setUpBlocklyForMusicLab();
      return;
    }
  } else if (!customBlocksConfig) {
    // Skip Blockly setup for other labs that don't use block pools.
    return;
  }
  Blockly.assetUrl = assetUrl;
  Blockly.typeHints = true;
  Blockly.cdoUtils.injectCss(document);

  // Spritelab-specific logic but not harmful to other labs.
  registerReducers({
    animationList,
  });
  const store = getStore();
  store.dispatch(setInitialAnimationList(exampleSprites));
  Blockly.valueTypeTabShapeMap = valueTypeTabShapeMap(Blockly);

  // Install common blocks like repeat loops and "when run"
  commonBlocks.install(Blockly, {
    skin: skinBase.load(Blockly.assetUrl, programmingEnvironmentName),
    isK1: false,
  });

  // Install custom blocks, ie. those defined in the block pool
  installCustomBlocks({
    blockly: Blockly,
    blockDefinitions: customBlocksConfig,
    customInputTypes,
  });
};

/**
 * Creates and renders an embedded Blockly block into the given container element.
 * @param {HTMLElement} container - The DOM node to render into
 * @param {string} blockType - The Blockly block type
 */
export function embedBlocklyBlock(container, blockType) {
  convertXmlToBlockly(container);
  const blocksDom = parseElement(`<block type='${blockType}' />`);
  addNameToProcedureBlocks(blocksDom);
  const blockSpace = Blockly.createEmbeddedWorkspace(container, blocksDom, {
    noScrolling: true,
    inline: true,
  });
  shrinkBlockSpaceContainer(blockSpace, true);
}

/**
 * Modifies the given block DOM element to add a default procedure name if it's a procedure block.
 *
 * @param {Element} blocksDom - An XML DOM element containing a single <block> node.
 * @private
 */
function addNameToProcedureBlocks(blocksDom) {
  const blockElement = blocksDom.querySelector('block');
  if (PROCEDURE_BLOCK_TYPES.includes(blockElement.getAttribute('type'))) {
    const fieldElement = document.createElement('field');
    fieldElement.setAttribute('name', 'NAME');
    fieldElement.textContent = Blockly.Msg.PROCEDURES_DEFNORETURN_PROCEDURE;
    blockElement.appendChild(fieldElement);
  }
}
