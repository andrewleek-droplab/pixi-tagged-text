import * as PIXI from "pixi.js";

const PX_PER_EM = 16;
const PX_PER_PERCENT = 16 / 100;
const PX_PER_PT = 1.3281472327365;

export const measureFont = (
  context: CanvasRenderingContext2D
): PIXI.IFontMetrics => PIXI.TextMetrics.measureFont(context.font);

export const INITIAL_FONT_PROPS: PIXI.IFontMetrics = {
  ascent: 10,
  descent: 3,
  fontSize: 13,
};

// TODO: Memoize
export const getFontPropertiesOfText = (
  textField: PIXI.Text,
  forceUpdate = false
): PIXI.IFontMetrics => {
  if (forceUpdate) {
    textField.updateText(false);
    return measureFont(textField.context);
  } else {
    const props = measureFont(textField.context);
    if (
      props.ascent === INITIAL_FONT_PROPS.ascent &&
      props.descent === INITIAL_FONT_PROPS.descent &&
      (textField.style.fontSize > INITIAL_FONT_PROPS.fontSize ||
        isNaN(textField.style.fontSize))
    ) {
      throw new Error(
        "getFontPropertiesOfText() returned metrics associated with a Text field that has not been updated yet. Please try using the forceUpdate parameter when you call this function."
      );
    }
    return measureFont(textField.context);
  }
};

export const checkPixiVersion = (
  version: string,
  expectedMajorVersion: number
): number => {
  const majorVersion = parseInt(version.split(".")[0], 10);
  if (majorVersion !== expectedMajorVersion) {
    throw new Error(
      `Detected Pixi.js version ${PIXI.VERSION}. pixi-multistyle-text supports Pixi.js version ${expectedMajorVersion}. (Please use v0.8.0 of this package for Pixi 4 support.)`
    );
  }
  return 0;
};

export const addChildrenToContainer = (
  children: PIXI.DisplayObject[],
  container: PIXI.Container
): void => children.forEach((child) => container.addChild(child));

export const cloneSprite = (sprite: PIXI.Sprite): PIXI.Sprite =>
  new PIXI.Sprite(sprite.texture);

export const fontSizeStringToNumber = (size: string): number => {
  const [valueString, unit] = size.split(/(%|pt|px|r?em)/);
  const value = parseFloat(valueString);

  if (isNaN(value)) {
    NaN;
  }

  switch (unit) {
    case "%":
      return value * PX_PER_PERCENT;
    case "em":
    case "rem":
      return value * PX_PER_EM;
    case "pt":
      return value * PX_PER_PT;
    case "px":
    default:
      // keep as is.
      return value;
  }
};
