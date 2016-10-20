import React, { PropTypes } from "react"
import { createStore, applyMiddleware } from "redux"
import { Provider, connect } from "react-redux"
import { reducer, createMiddleware, prefix, creators } from "./reducer"

export { reducer, createMiddleware } from "./reducer"

const PARENT_ID = `${prefix}/parentID`

export class TitleProvider extends React.Component {
    static propTypes = {
        children: PropTypes.node,
    }
    constructor () {
        super()
        this.store = createStore(reducer,
            applyMiddleware(createMiddleware()))
    }
    render () {
        return (
            <Provider store={this.store}>
                {this.props.children}
            </Provider>
        )
    }
}

class Title extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        id: PropTypes.string.isRequired,
        title: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string,
        ]),
        onMount: PropTypes.func.isRequired,
        onUpdate: PropTypes.func.isRequired,
        onUnmount: PropTypes.func.isRequired,
    };
    static contextTypes = {
        [PARENT_ID]: PropTypes.string,
    };
    static childContextTypes = Title.contextTypes;
    getChildContext () {
        return { [PARENT_ID]: this.props.id }
    }
    componentWillMount () {
        const { onMount, title, id } = this.props
        onMount(title, id, this.context[PARENT_ID])
    }
    componentDidUpdate () {
        const { onUpdate, title, id } = this.props
        onUpdate(title, id, this.context[PARENT_ID])
    }
    componentWillUnmount () {
        const { onUnmount, id } = this.props
        onUnmount(id)
    }
    render () {
        return this.props.children
    }
}

const ConnectedTitle = connect(() => ({}), creators)(Title)
export { ConnectedTitle as Title }
