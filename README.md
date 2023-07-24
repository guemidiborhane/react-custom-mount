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
    registerCustomElements,
    Components
} from 'react-custom-mount'

const ComponentOne = ({ myAttribute, children }) => {
    return (
        <>
            <p>Hello {myAttribute}</p>
            {children}
        </>
    )
}

const components: Components = {
    'component-one': ComponentOne
}

document.addEventListener('DOMContentLoaded', function () {
    // Register multiple components
    registerCustomElements(componenets)

    // Or one
    registerCustomElement('component-one', ComponentOne)
})
```

```html
<component-one my-attribute="hello">
    <div>
        <p>From the other side</p>
    </div>
</component-one>
```

## License

MIT © [Borhaneddine GUEMIDI](https://github.com/guemidiborhane), [Sofiane DEBBAGH](https://github.com/Redight)
