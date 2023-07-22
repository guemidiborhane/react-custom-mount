import { FunctionComponent } from 'react'
import { Root, createRoot } from 'react-dom/client'
import { Props } from '.'
import { parseAttributes, renderElement, unmountComponent } from './helpers'

export const registeredElements: { [key: string]: boolean } = {}

export function registerCustomElement(
    ComponentClass: FunctionComponent<any>,
    tagName: string
) {
    if (registeredElements[tagName]) {
        console.warn(
            `Custom element with tag name "${tagName}" is already registered.`
        )
        return
    }

    class CustomElement extends HTMLElement {
        root: Root | null = createRoot(this)
        props: Props = {
            children: []
        }

        isRendered = false

        ComponentClass: FunctionComponent<any>

        constructor() {
            super()
            this.ComponentClass = ComponentClass
            this.ComponentClass.displayName = tagName
        }

        connectedCallback() {
            this.props = parseAttributes(this)
            renderElement.call(this)
        }

        disconnectedCallback() {
            unmountComponent.call(this)
        }

        attributeChangedCallback() {
            renderElement.call(this)
        }
    }

    if (!customElements.get(tagName)) {
        customElements.define(tagName, CustomElement)
        registeredElements[tagName] = true
    }
}
