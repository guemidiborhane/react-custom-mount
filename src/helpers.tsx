import React, { StrictMode, createElement } from 'react'
import { CustomElementInterface } from './types'

export function camelCase(str: string) {
    return str.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
}

export const renderElement = function (this: CustomElementInterface) {
    if (!this.root) return

    if (!this.isRendered && this.isConnected) {
        this.root.render(
            <StrictMode>
                <this.ComponentClass
                    {...this.props}
                    children={parseChildren(this.children)}
                />
            </StrictMode>
        )

        this.isRendered = true
    }
}
export const parseChildren = function (
    children: HTMLCollection
): React.ReactNode[] {
    if (children.length === 0) return []
    return Array.from(children).map((child, key) => {
        if (child instanceof HTMLElement) {
            return parseHTMLElement(child, key)
        } else {
            // Return the text content as it is for TextNodes
            return child.textContent
        }
    })
}

const parseHTMLElement = function (element: HTMLElement, key: number) {
    const tagName = element.tagName.toLowerCase()
    const props = parseAttributes(element)

    const specialTags = ['input']

    if (specialTags.includes(tagName)) {
        return createElement(tagName, { key, ...props, children: null })
    } else {
        const children =
            element.children.length > 0
                ? parseChildren(element.children)
                : element.innerText
        return createElement(tagName, { key, ...props }, children)
    }
}

export const unmountComponent = function (this: CustomElementInterface) {
    if (this.root) {
        this.root.unmount()
        this.root = null
        this.isRendered = false
    }
}

type Props = {
    [key: string]: string | number | boolean | null
}

export const parseAttributes = function (element: HTMLElement) {
    const props: Props = {}
    for (const attr of Array.from(element.attributes)) {
        const attrName = attr.nodeName
        const attrValue = attr.nodeValue

        if (attrName.startsWith(':')) {
            // Special attribute prefixed with ":"
            const propName = camelCase(attrName.slice(1))
            props[propName] = attrValue != null ? parseValue(attrValue) : null
        } else {
            // Regular attribute
            const propName = camelCase(attrName)

            switch (attrName) {
                case 'class':
                    props.className = attrValue
                    break
                case 'for':
                    props.htmlFor = attrValue
                    break
                case 'value':
                    props.defaultValue = attrValue
                    break
                default:
                    props[propName] = attrValue
                    break
            }
        }
    }

    return props
}

export const parseValue = function (value: string) {
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

export function createContainer(tagName: string) {
    const container = document.createElement('div')
    container.setAttribute(
        'id',
        `${tagName}-${Math.floor(Math.random() * 100000)}`
    )
    return container
}
