import { createElement } from "Core/DOM/createElement";

/**
 * This file provides a comprehensive TypeScript declaration for JSX elements,
 * associating each HTML element with specific props to ensure type safety
 * and a streamlined development experience when creating custom elements
 * with the `createElement` function.
 *
 * The `CommonProps` interface serves as a base for all elements, defining
 * properties that are generally applicable, such as `className`, `id`, and `style`.
 *
 * Additional interfaces like `AnchorProps`, `ImageProps`, and `ButtonProps`
 * extend `CommonProps` to add more specialized attributes for certain elements.
 */

/**
 * CommonProps defines the general properties that can be applied to most HTML elements.
 */
interface CommonProps {
  /**
   * A string representing one or more CSS classes to be applied to the element.
   */
  className?: string;

  /**
   * A string representing the unique ID of the element.
   */
  id?: string;

  /**
   * An object representing inline CSS styles, where the keys are CSS property names and
   * the values are the corresponding styles (either strings or numbers).
   */
  style?: { [key: string]: string | number };
}

/**
 * Defines properties for the `<a>` (anchor) element, extending CommonProps.
 */
interface AnchorProps extends CommonProps {
  /**
   * The URL that the hyperlink points to.
   */
  href?: string;

  /**
   * Specifies where to open the linked document. Common values are `_blank`, `_self`, etc.
   */
  target?: string;

  /**
   * Specifies the relationship between the current document and the linked document.
   */
  rel?: string;
}

/**
 * Defines properties for the `<img>` element, extending CommonProps.
 */
interface ImageProps extends CommonProps {
  /**
   * The image file source URL.
   */
  src: string;

  /**
   * Alternative text for the image.
   */
  alt?: string;
}

/**
 * Defines properties for the `<button>` element, extending CommonProps.
 */
interface ButtonProps extends CommonProps {
  /**
   * A function that gets called when the button is clicked.
   */
  onClick?: (event: MouseEvent) => void;
}

/**
 * The JSX namespace defines intrinsic elements, which are standard HTML tags,
 * and associates them with specific prop types.
 * It includes various elements like <a>, <img>, <button>, and many others,
 * with their corresponding props for strong typing support.
 */
declare namespace JSX {
  interface IntrinsicElements {
    /**
     * Intrinsic elements represent standard HTML tags, such as `<a>`, `<div>`, etc.
     * Each tag has its corresponding prop types defined for safe and intuitive usage.
     */
    a: AnchorProps; // <a> element with AnchorProps
    img: ImageProps; // <img> element with ImageProps
    button: ButtonProps; // <button> element with ButtonProps

    // Various common HTML elements mapped to CommonProps
    abbr: CommonProps;
    address: CommonProps;
    area: CommonProps;
    article: CommonProps;
    aside: CommonProps;
    audio: CommonProps;
    b: CommonProps;
    base: CommonProps;
    bdi: CommonProps;
    bdo: CommonProps;
    blockquote: CommonProps;
    br: CommonProps;
    canvas: CommonProps;
    caption: CommonProps;
    cite: CommonProps;
    code: CommonProps;
    col: CommonProps;
    colgroup: CommonProps;
    data: CommonProps;
    datalist: CommonProps;
    dd: CommonProps;
    del: CommonProps;
    details: CommonProps;
    dfn: CommonProps;
    dialog: CommonProps;
    div: CommonProps;
    dl: CommonProps;
    dt: CommonProps;
    em: CommonProps;
    embed: CommonProps;
    fieldset: CommonProps;
    figcaption: CommonProps;
    figure: CommonProps;
    footer: CommonProps;
    form: CommonProps;
    h1: CommonProps;
    h2: CommonProps;
    h3: CommonProps;
    h4: CommonProps;
    h5: CommonProps;
    h6: CommonProps;
    header: CommonProps;
    hgroup: CommonProps;
    hr: CommonProps;
    html: CommonProps;
    i: CommonProps;
    iframe: CommonProps;
    input: CommonProps;
    ins: CommonProps;
    kbd: CommonProps;
    label: CommonProps;
    legend: CommonProps;
    li: CommonProps;
    link: CommonProps;
    main: CommonProps;
    map: CommonProps;
    mark: CommonProps;
    meta: CommonProps;
    meter: CommonProps;
    nav: CommonProps;
    noscript: CommonProps;
    object: CommonProps;
    ol: CommonProps;
    optgroup: CommonProps;
    option: CommonProps;
    output: CommonProps;
    p: CommonProps;
    param: CommonProps;
    picture: CommonProps;
    pre: CommonProps;
    progress: CommonProps;
    q: CommonProps;
    rp: CommonProps;
    rt: CommonProps;
    ruby: CommonProps;
    s: CommonProps;
    samp: CommonProps;
    script: CommonProps;
    section: CommonProps;
    select: CommonProps;
    small: CommonProps;
    source: CommonProps;
    span: CommonProps;
    strong: CommonProps;
    style: CommonProps;
    sub: CommonProps;
    summary: CommonProps;
    sup: CommonProps;
    table: CommonProps;
    tbody: CommonProps;
    td: CommonProps;
    template: CommonProps;
    textarea: CommonProps;
    tfoot: CommonProps;
    th: CommonProps;
    thead: CommonProps;
    time: CommonProps;
    title: CommonProps;
    tr: CommonProps;
    u: CommonProps;
    ul: CommonProps;
    var: CommonProps;
    video: CommonProps;
    wbr: CommonProps;
  }

  /**
   * The Element interface represents the type of a JSX element.
   * It includes a `nodeType` property, typically used to identify the type of node in the DOM.
   */
  interface Element {
    /**
     * The type of the node in the DOM, represented by a number.
     */
    nodeType: number;
  }
}

/**
 * The `JSX.IntrinsicElements` interface can be globally extended
 * to add custom elements or modify existing ones, making it flexible
 * for custom rendering engines.
 */
declare global {
  namespace JSX {
    /**
     * This allows adding custom intrinsic elements or modifying the
     * existing elements to fit your rendering engine or framework.
     */
    interface IntrinsicElements {
      [elem: string]: CommonProps & { [key: string]: any };
    }
  }
}
