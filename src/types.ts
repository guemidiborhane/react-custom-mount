import type { Root } from 'react-dom/client'
import type { FunctionComponent, ReactElement } from 'react'

export type Components = {
    [key: string]: FunctionComponent<any>
}

export type Props = {
    [key: string]: any
    children?: ReactElement[]
}

export interface CustomElementInterface extends HTMLElement {
    root: Root | null
    props: Props
    isRendered: boolean
    ComponentClass: FunctionComponent<any>
}
