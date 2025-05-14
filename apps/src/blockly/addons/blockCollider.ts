import * as Blockly from 'blockly/core';

export default class BlockColliderFrame {
  private block: Blockly.BlockSvg;
  private frameGroup_: SVGElement | undefined;
  private outlineRect_: SVGElement | undefined;

  constructor(block: Blockly.BlockSvg) {
    this.block = block;
    this.init();
  }

  dispose() {
    this.frameGroup_?.remove();
    this.frameGroup_ = undefined;
    this.outlineRect_ = undefined;
  }

  init() {
    const blockId = this.block.id.replace(/[^\w\s]|_/g, '');

    this.frameGroup_ = Blockly.utils.dom.createSvgElement('g', {
      class: 'svgColliderFrame',
    });

    this.outlineRect_ = Blockly.utils.dom.createSvgElement(
      'rect',
      {
        x: 0,
        y: 0,
        stroke: 'red',
        'stroke-width': 4,
        fill: 'red',
        'fill-opacity': 0.3,
        rx: 1,
        ry: 1,
        id: `colliderOutline${blockId}`,
      },
      this.frameGroup_
    );

    const svgGroup = this.block.getSvgRoot();
    svgGroup?.prepend(this.frameGroup_);
  }

  render() {
    if (!this.frameGroup_ || !this.outlineRect_) {
      return;
    }

    this.frameGroup_.remove();

    const blockSvgGroup = this.block.getSvgRoot();
    const bbox = blockSvgGroup.getBoundingClientRect();

    const width = bbox.width;
    const height = bbox.height;

    this.outlineRect_.setAttribute('width', `${width}`);
    this.outlineRect_.setAttribute('height', `${height}`);
    this.outlineRect_.setAttribute('x', `0`);
    this.outlineRect_.setAttribute('y', `0`);

    blockSvgGroup?.append(this.frameGroup_);
  }
}
