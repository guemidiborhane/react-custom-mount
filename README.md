# react-custom-mount

> Mount react components using custom elements

[![NPM](https://img.shields.io/npm/v/react-custom-mount.svg)](https://www.npmjs.com/package/react-custom-mount) [![JavaScript Style Guide](https://img.shields.io/badge/code_style-standard-brightgreen.svg)](https://standardjs.com)

## Install

```bash
npm install --save react-custom-mount
```

## Usage

```tsx
import {
  registerCustomElement,
  Components
} from 'guemidiborhane/react-custom-mount'

const components: Components = {
  'component-one': ComponentOne,
  'component-two': ComponentTwo,
  'component-three': ComponentThree
}

document.addEventListener('DOMContentLoaded', function () {
  Object.entries(components).forEach(([tag, component]) => {
    registerCustomElement(component, tag)
  })
})
```

## License

MIT © [guemidiborhane](https://github.com/guemidiborhane)
