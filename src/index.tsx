import React, { FunctionComponent, StrictMode } from 'react'
import { createRoot, Root } from 'react-dom/client'

export type Components = {
  [key: string]: FunctionComponent<any>
}

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
    private root: Root | null = createRoot(
      this.appendChild(createElement(tagName))
    )
    private props: { [key: string]: any } = {}
    private isRendered = false

    constructor() {
      super()
      ComponentClass.displayName = tagName
    }

    connectedCallback() {
      if (!this.isRendered) {
        this.parseAttributes()
        this.renderElement()
      }
    }

    disconnectedCallback() {
      this.unmountComponent()
    }

    attributeChangedCallback() {
      this.renderElement()
    }

    private renderElement() {
      if (!this.root) return

      if (!this.isRendered && this.isConnected) {
        this.root.render(
          <StrictMode>
            <ComponentClass {...this.props} />
          </StrictMode>
        )

        this.isRendered = true
      }
    }

    private unmountComponent() {
      if (this.root) {
        this.root.unmount()
        this.root = null
        this.isRendered = false
      }
    }

    private parseAttributes() {
      const attributes = Array.from(this.attributes)
      for (const attr of attributes) {
        const attrName = attr.nodeName
        const attrValue = attr.nodeValue

        if (attrName.startsWith(':')) {
          // Special attribute prefixed with ":"
          const propName = camelCase(attrName.slice(1))
          this.props[propName] =
            attrValue != null ? this.parseValue(attrValue) : null
        } else {
          // Regular attribute
          const propName = camelCase(attrName)
          this.props[propName] = attrValue
        }
      }
    }

    private parseValue(value: string) {
      // Parse ints and booleans if applicable
      if (/^-?\d+$/.test(value)) {
        return parseInt(value, 10)
      } else if (value === 'true') {
        return true
      } else if (value === 'false') {
        return false
      }

      // Try parsing JSON
      try {
        return JSON.parse(value)
      } catch (error) {
        // Return the original value if JSON parsing fails
        return value
      }
    }
  }

  if (!customElements.get(tagName)) {
    customElements.define(tagName, CustomElement)
    registeredElements[tagName] = true
  }
}

function camelCase(str: string) {
  return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

function createElement(tagName: string) {
  const container = document.createElement('div')
  container.setAttribute(
    'id',
    `${tagName}-${Math.floor(Math.random() * 100000)}`
  )
  return container
}
