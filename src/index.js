import React, { PropTypes } from "react"

// TODO: handle multiple title children?
export default class Title extends React.Component {
    static propTypes = {
        children: PropTypes.node,
        title: PropTypes.oneOfType([
            PropTypes.func,
            PropTypes.string,
        ]),
    };
    static contextTypes = {
        setDocumentTitle: PropTypes.func,
    };
    static childContextTypes = Title.contextTypes;
    componentDidMount () {
        this.setTitle()
    }
    componentDidUpdate () {
        this.setTitle()
    }
    getChildContext () {
        return {
            setDocumentTitle: (childTitle) => { this.setTitle(childTitle) },
        }
    }
    getTitle (childTitle) {
        const { title } = this.props
        if (!title) { return "" }
        if (typeof title === "string") { return title }
        return title(childTitle)
    }
    setTitle (childTitle) {
        const fullTitle = this.getTitle(childTitle)

        // if there is a parent title
        if (this.context.setDocumentTitle) {
            // pass my title up to the parent
            this.context.setDocumentTitle(fullTitle)
        } else {
            // set the global title
            document.title = fullTitle
        }
    }
    render () {
        return this.props.children
    }
}
