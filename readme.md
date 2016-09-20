# react-composable-title

**EXPERIMENTAL, UNTESTED CODE** but hey, I'm not your dad, use it if you want

---

This is a reinterpretation of [react-document-title](https://github.com/gaearon/react-document-title) with some added notions of "composability," inspired by [React Router v4](https://react-router.now.sh/).

## Installation

don't

## Example

```js
import React from "react"
import { Match } from "react-router"
import Title from "react-composable-title"

function Parent () {
    return (
        <Title title={(child) =>
            child ? `${child} | My Cool App` : "My Cool App"
        }/>
            <div>
                <Match exactly pattern="/" component={Home} />
                <Match pattern="/foo" component={Foo} />
                <Match pattern="/bar/:id" component={Bar} />
            </div>
        </Title>
    )
}

function Home () {
    return <div>Home Page</div>
}

function Foo () {
    return <Title title="Foo">
        Foo page
    </Title>
}

function Bar ({ params }) {
    return <Title title={`Bar ${params.id}`}>
        Bar page
    </Title>
}

```

### Results

- `/` : "My Cool App"
- `/foo` : "Foo | My Cool App"
- `/bar/20` : "Bar 20 | My Cool App"

## TODOs

- tests
- handle multiple children
- handle cases where parent is updated and child is not
