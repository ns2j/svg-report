# svg-report

`svg-report` is a JavaScript library for creating printable reports and documents from SVG templates.

Design your document visually with [Inkscape](https://inkscape.org/), place placeholders such as `%name%` and `%price%` in the SVG, and use `svg-report` to replace them with values at runtime.

The goal is to make **the browser view and the printed result look as similar as possible**, while keeping document layout separate from application code.

The original idea was inspired by [svg-paper](https://github.com/ttskch/svg-paper).

## Features

- Use SVG files created with Inkscape as report templates
- Replace placeholders with values from JavaScript / JSON
- Single-line text alignment
- Multi-line text areas
- Automatic text fitting
- Configurable text width and height
- Configurable font size
- Vertical alignment for multi-line text
- Multiple-page reports
- Browser display and printing
- No runtime dependencies

Typical use cases include:

- Invoices
- Quotations
- Receipts
- Order forms
- Application forms
- Business reports
- Fixed-layout printable documents

## How it works

The basic workflow is:

```text
Inkscape SVG template
        |
        | placeholders such as %name%, %price%
        v
    svg-report
        ^
        |
    SvgRecipe
        |
        | values and layout options
        v
Browser rendering / Printing
```

The document layout is created in Inkscape rather than in JavaScript.

For example, an SVG template may contain:

```text
%customerName%

%item1%

%price1%
```

`svg-report` finds these placeholders in SVG `<text>` elements and replaces them with values supplied by an `SvgRecipe`.

## Build

Install dependencies:

```bash
npm install
```

Build the production version:

```bash
npm run build:prod
```

For a development build:

```bash
npm run build
```

## Sample

Install the sample application:

```bash
cd sample
npm install
```

Run it:

```bash
npm start
```

Then open:

```text
http://localhost:8080/
```

The sample demonstrates a multi-page printable document including long text, large numeric values, alignment, and multi-line text areas.

## Basic usage

Create an SVG template with Inkscape and put placeholders in text elements.

For example:

```text
%name%
%price%
%comment%
```

Then create an `SvgRecipe`:

```javascript
const recipe = {
  svgUrl: "template.svg",

  holderMap: {
    "%name%": {
      value: "Product A"
    },

    "%price%": {
      value: "12,000",
      opt: {
        align: "e",
        width: 30
      }
    },

    "%comment%": {
      value: "This is a long comment\nwith multiple lines.",
      opt: {
        align: "T",
        width: 80,
        height: 30
      }
    }
  }
};
```

Render the report:

```javascript
const report = new SvgReport(recipe, "#report");

report.render();
```

The rendered SVG is inserted into the specified element.

## SvgRecipe format

A recipe can describe one SVG page:

```javascript
{
  "svgUrl": "template.svg",

  "holderMap": {

    "%name%": {
      "value": "Product A"
    },

    "%price%": {
      "value": "1,000",
      "opt": {
        "align": "e",
        "width": 30
      }
    }

  }
}
```

A report can also contain multiple pages by passing an array of recipes:

```javascript
[
  {
    "svgUrl": "page1.svg",
    "holderMap": {
      "%name%": {
        "value": "Product A"
      }
    }
  },

  {
    "svgUrl": "page2.svg",
    "holderMap": {
      "%comment%": {
        "value": "Second page"
      }
    }
  }
]
```

Each SVG template becomes one report page.

## Placeholder rules

Placeholders are ordinary text inside the SVG.

For example:

```text
%customer%
```

The corresponding recipe entry is:

```javascript
"%customer%": {
  "value": "John Smith"
}
```

The same placeholder may appear more than once in an SVG template. All matching text elements are filled with the specified value.

## Text options

The `opt` object controls how text is rendered.

```javascript
{
  "value": "some value",

  "opt": {
    "align": "m",
    "width": 30,
    "height": 20,
    "fontSize": 12
  }
}
```

### `align`

For single-line text:

| Value | Alignment |
|---|---|
| `s` | Start |
| `m` | Middle |
| `e` | End |

Example:

```javascript
"%price%": {
  "value": "10,000",
  "opt": {
    "align": "e"
  }
}
```

This is useful for right-aligning numeric values.

For multi-line text areas:

| Value | Vertical alignment |
|---|---|
| `T` | Top |
| `M` | Middle |
| `B` | Bottom |

Example:

```javascript
"%description%": {
  "value": "Long product description...",
  "opt": {
    "align": "T"
  }
}
```

Uppercase `T`, `M`, and `B` indicate that the value should be handled as a multi-line text area.

### `width`

Specifies the available text width.

```javascript
"opt": {
  "width": 30
}
```

For single-line text, text that is too long for the specified area is adjusted to fit.

### `height`

Specifies the height of a multi-line text area.

```javascript
"opt": {
  "width": 80,
  "height": 30
}
```

The library automatically adjusts multi-line text so that it fits inside the specified area.

### `fontSize`

Specifies the desired font size.

```javascript
"opt": {
  "fontSize": 14
}
```

For multi-line text, the font size may be reduced automatically when the text does not fit inside the available area.

## Multi-line text

A value may contain newline characters:

```javascript
"%comment%": {
  "value": "First line\nSecond line\nThird line",
  "opt": {
    "align": "T",
    "width": 80,
    "height": 30
  }
}
```

`svg-report` calculates the available area, splits the text into logical lines, and adjusts the font size when necessary.

This makes it possible to use fixed-size areas in an SVG template even when the amount of text varies.

## Text fitting

One of the main purposes of `svg-report` is handling values whose size cannot be known when the SVG template is designed.

For example:

```text
1,000
```

and:

```text
100,000,000,000,000,000
```

may need to occupy the same field.

For single-line text, `svg-report` uses SVG text-length adjustment when necessary.

For multi-line text, it calculates the number of lines that fit in the available area and reduces the font size when necessary.

## Creating templates with Inkscape

SVG templates should be created with Inkscape.

The basic process is:

1. Create the document layout in Inkscape.
2. Add text objects where dynamic values should appear.
3. Enter placeholders such as `%name%`, `%price%`, or `%comment%`.
4. Save the document as SVG.
5. Create an `SvgRecipe` that maps the placeholders to actual values.

This approach allows the visual layout of a report to be edited without rewriting JavaScript or HTML/CSS.

Designers can work on the SVG layout while application code only needs to supply data.

## Multiple pages

Pass an array of recipes to create a multi-page report:

```javascript
const recipe = [
  {
    svgUrl: "page1.svg",
    holderMap: {
      "%title%": {
        value: "Page 1"
      }
    }
  },

  {
    svgUrl: "page2.svg",
    holderMap: {
      "%title%": {
        value: "Page 2"
      }
    }
  }
];

const report = new SvgReport(recipe, "#report");

report.render();
```

## Page selection

The `SvgReport` instance provides methods for controlling displayed pages.

### `select(index)`

Displays only the specified page.

```javascript
report.select(0);
```

Use a negative index to display all pages:

```javascript
report.select(-1);
```

### `show(index)`

Shows a specified page:

```javascript
report.show(1);
```

### `getNumPage()`

Returns the number of report pages:

```javascript
const pages = report.getNumPage();
```

## Why SVG?

Traditional HTML/CSS is excellent for responsive documents, but fixed-layout business forms can be difficult to reproduce precisely for printing.

SVG provides several advantages for this kind of document:

- Precise positioning
- Vector graphics
- Scalable output
- Good browser support
- Printable directly from the browser
- Visual editing with Inkscape
- SVG DOM manipulation from JavaScript

With `svg-report`, SVG acts as both the **document template** and the **rendering format**.

## Project structure

```text
svg-report/
├── js/
│   └── src/
│       ├── svg-report.js
│       ├── adjust-text.js
│       ├── adjust-textarea.js
│       └── utility/
│
├── scss/
│
├── sample/
│   ├── static/
│   │   ├── index.html
│   │   ├── templ1.svg
│   │   └── templ2.svg
│   ├── svgrecipe.js
│   └── server.js
│
├── package.json
└── webpack.config.js
```

## Development

Development build:

```bash
npm run build
```

Production build:

```bash
npm run build:prod
```

Watch files:

```bash
npm run watch
```

Run tests:

```bash
npm test
```

## License

MIT License
