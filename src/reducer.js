export const prefix = "@modernserf/react-composable-title"

const actions = [
    "mount",
    "update",
    "unmount",
].reduce((m, key) => {
    m[key] = `${prefix}/${key}`
    return m
}, {})

export const creators = {
    onMount: (title, id, parentID) => ({
        type: actions.mount,
        payload: { title, id, parentID },
    }),
    onUpdate: (title, id, parentID) => ({
        type: actions.update,
        payload: { title, id, parentID },
    }),
    onUnmount: (id) => ({ type: actions.unmount, payload: id }),
}

const initState = {}

export function reducer (state = initState, { type, payload }) {
    switch (type) {
    case actions.mount:
    case actions.update: {
        const { id, parentID, title } = payload
        return { ...state, [id]: { parentID, title } }
    }
    case actions.unmount:
        return { ...state, [payload]: undefined }
    default:
        return state
    }
}

function getTitleForComponent ({ title, children }) {
    if (typeof title === "string") { return title }

    let firstChild
    const childTitles = {}
    for (let i = 0; i < children.length; i++) {
        const child = children[i]
        const title = getTitleForComponent(child)
        if (!i) { firstChild = title }
        childTitles[child.id] = title
    }

    return title(firstChild, childTitles)
}

export function getTitle (state) {
    const withChildren = {}
    let root
    for (const key in state) {
        withChildren[key] = { ...state[key], id: key, children: [] }
    }
    for (const key in withChildren) {
        const child = withChildren[key]
        if (child.parentID) {
            const parent = withChildren[child.parentID]
            // TODO: throw if no parent
            parent.children.push(child)
        } else {
            // TODO: throw if multiple roots
            root = child
        }
    }
    // TODO: throw if no root
    return getTitleForComponent(root)
}

export function createMiddleware (select = (state) => state) {
    const actionSet = {}
    for (const key in actions) {
        actionSet[actions[key]] = true
    }

    return ({ getState }) => (next) => (action) => {
        const res = next(action)

        if (actionSet[action.type]) {
            const title = getTitle(select(getState()))
            document.title = title
        }

        return res
    }
}
