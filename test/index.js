require("./jsdom-helper.js")

const test = require("tape")
const { createStore, combineReducers, applyMiddleware } = require("redux")
const React = require("react")
const { mount } = require("enzyme")
const { Provider } = require("react-redux")
const {
    Title, TitleProvider,
    reducer: titleReducer, createMiddleware: createTitleMiddleware,
} = require("../dist/index.js")

const h = React.createElement

test("it sets the title", (t) => {
    document.title = "Init Title"

    const reducer = combineReducers({
        title: titleReducer,
    })
    const middleware = createTitleMiddleware((state) => state.title)

    const store = createStore(reducer, applyMiddleware(middleware))

    const Component = () =>
        h(Title, { id: "main", title: "React Title" },
            h("div", {}, "Content"))

    const app = h(Provider, { store }, h(Component))
    mount(app)
    t.equal(document.title, "React Title")
    t.end()
})

test("it sets the title as a function", (t) => {
    document.title = "Init Title"

    const reducer = combineReducers({
        title: titleReducer,
    })
    const middleware = createTitleMiddleware((state) => state.title)

    const store = createStore(reducer, applyMiddleware(middleware))

    const Component = () =>
        h(Title, { id: "main", title: () => "React Title" },
            h("div", {}, "Content"))

    const app = h(Provider, { store }, h(Component))
    mount(app)
    t.equal(document.title, "React Title")
    t.end()
})

test("it composes titles", (t) => {
    document.title = "Init Title"

    const reducer = combineReducers({
        title: titleReducer,
    })
    const middleware = createTitleMiddleware((state) => state.title)

    const store = createStore(reducer, applyMiddleware(middleware))

    const Component = () =>
        h(Title, { id: "main", title: (child) => `${child} | Parent` },
            h(Title, { id: "child", title: "Child" },
                h("div", {}, "Content")))

    const app = h(Provider, { store }, h(Component))
    mount(app)
    t.equal(document.title, "Child | Parent")
    t.end()
})

test("it composes multiple titles", (t) => {
    document.title = "Init Title"

    const reducer = combineReducers({
        title: titleReducer,
    })
    const middleware = createTitleMiddleware((state) => state.title)

    const store = createStore(reducer, applyMiddleware(middleware))

    const Component = () =>
        h(Title, {
            id: "main",
            title: (_, { left, right }) => `${left} ${right}`,
        }, h("div", {}, [
            h(Title, { key: "left", id: "left", title: "Left" },
                h("div", {}, "Content")),
            h(Title, { key: "right", id: "right", title: "Right" },
                h("div", {}, "Content")),
        ]))

    const app = h(Provider, { store }, h(Component))
    mount(app)
    t.equal(document.title, "Left Right")
    t.end()
})

test("it handles its own state via TitleProvider", (t) => {
    document.title = "Init Title"

    const Component = () =>
        h(TitleProvider, {},
            h(Title, { id: "main", title: (child) => `${child} | Parent` },
                h(Title, { id: "child", title: "Child" },
                    h("div", {}, "Content"))))

    mount(h(Component))
    t.equal(document.title, "Child | Parent")
    t.end()
})
