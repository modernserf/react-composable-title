# react-composable-title
---

This is a reinterpretation of [react-document-title](https://github.com/gaearon/react-document-title) with some added notions of "composability," inspired by [React Router v4](https://react-router.now.sh/), and uses Redux under the hood.

## Installation

`npm install react-composable-title react redux react-redux`

## Example

```js
import React from "react"
import { Match } from "react-router"
import { Title, TitleProvider } from "react-composable-title"

function App () {
    return (
        <TitleProvider>
            <Title title={(child) =>
                child ? `${child} | My Cool App` : "My Cool App"
            }/>
                <div>
                    <Match exactly pattern="/" component={Home} />
                    <Match pattern="/foo" component={Foo} />
                    <Match pattern="/bar/:id" component={Bar} />
                </div>
            </Title>
        </TitleProvider>
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
