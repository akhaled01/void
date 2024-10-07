/**
 * A declaration module for `.png` files, allowing you to import
 * PNG images as string values, typically their file paths.
 *
 * This is useful when working with bundlers like Webpack that handle
 * image files and replace the imports with the correct file paths.
 *
 * @example
 * import myImage from './image.png';
 * console.log(myImage); // Outputs the image file path
 */
declare module "*.png" {
  /**
   * The file path or URL of the imported PNG image.
   * @type {string}
   */
  const value: string;
  export default value;
}

/**
 * A declaration module for `.jpg` files, allowing you to import
 * JPEG images as string values, typically their file paths.
 *
 * @example
 * import myImage from './image.jpg';
 * console.log(myImage); // Outputs the image file path
 */
declare module "*.jpg" {
  /**
   * The file path or URL of the imported JPEG image.
   * @type {string}
   */
  const value: string;
  export default value;
}

/**
 * A declaration module for `.jpeg` files, allowing you to import
 * JPEG images as string values, typically their file paths.
 *
 * @example
 * import myImage from './image.jpeg';
 * console.log(myImage); // Outputs the image file path
 */
declare module "*.jpeg" {
  /**
   * The file path or URL of the imported JPEG image.
   * @type {string}
   */
  const value: string;
  export default value;
}

/**
 * A declaration module for `.gif` files, allowing you to import
 * GIF images as string values, typically their file paths.
 *
 * @example
 * import myGif from './image.gif';
 * console.log(myGif); // Outputs the GIF file path
 */
declare module "*.gif" {
  /**
   * The file path or URL of the imported GIF image.
   * @type {string}
   */
  const value: string;
  export default value;
}
