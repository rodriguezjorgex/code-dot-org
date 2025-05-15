import * as GoogleBlockly from 'blockly/core';

export default class CdoFieldTextInput extends GoogleBlockly.FieldTextInput {
  protected override set size_(value: GoogleBlockly.utils.Size) {}

  protected override get size_(): GoogleBlockly.utils.Size {
    const constants = this.getConstants();
    const xOffset = !this.isFullBlockField()
      ? this.getConstants()!.FIELD_BORDER_RECT_X_PADDING
      : 0;
    let totalWidth = xOffset * 2;
    let totalHeight = constants!.FIELD_TEXT_HEIGHT;

    let contentWidth = 0;
    if (this.textElement_) {
      contentWidth = GoogleBlockly.utils.dom.getTextWidth(this.textElement_);
      totalWidth += contentWidth;
    }
    if (!this.isFullBlockField()) {
      totalHeight = Math.max(totalHeight, constants!.FIELD_BORDER_RECT_HEIGHT);
    }
    return {width: totalWidth, height: totalHeight};
  }
}
