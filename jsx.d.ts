interface CommonProps {
  className?: string;
  id?: string;
  style?: { [key: string]: string | number };
}

interface AnchorProps extends CommonProps {
  href?: string;
  target?: string;
  rel?: string;
}

// Define specific props for other elements as needed
interface ImageProps extends CommonProps {
  src: string;
  alt?: string;
}

interface ButtonProps extends CommonProps {
  onClick?: (event: MouseEvent) => void;
}

declare namespace JSX {
  interface IntrinsicElements {
    a: AnchorProps; // Using AnchorProps for <a> element
    img: ImageProps; // Using ImageProps for <img> element
    button: ButtonProps; // Using ButtonProps for <button> element
    // Add more elements and their specific props as needed
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

  interface Element {
    // This type should match the output of your createElement function
    nodeType: number;
    // You can define other properties if needed
  }
}

// Define the JSX namespace globally
declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elem: string]: CommonProps & { [key: string]: any };
    }
  }
}
