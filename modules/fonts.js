import removes from "lodash/remove";

let fontsReference = [
  // storage for fonts info
  {
    name: "Roboto",
    weights: ["300", "400", "500"]
  }
];

/**
 * Replace the fontsReference
 *
 * @param {Array} fonts The new set of fonts
 */
export const setFontsReference = fonts => {
  fontsReference = fonts;
};

/**
 * Adds a new font to fontsReference
 *
 * @param {Object} font New font. Should specify google font name and weights
 */
export const addFont = font => {
  fontsReference.push(font);
};

/**
 * Removes a font from fontsReference
 *
 * @param {String} fontName name of the font to remove
 */

export const removeFont = fontName => {
  remove(fontsReference, ({ name }) => name === fontName);
};

/**
 * Gets the GoogleFont string to make the call to the CDN
 *
 * @returns {String} The string to use as href in <link>
 */
const getGoogleFontLoadString = () => {
  const fonts = fontsReference.reduce((accumulator, font) => {
    return [...accumulator, `${font.name}:${font.weights.join(",")}`];
  }, []);
  return `https://fonts.googleapis.com/css?family=${fonts.join("|")}"`;
};

export default getGoogleFontLoadString;