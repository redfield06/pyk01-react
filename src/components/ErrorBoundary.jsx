import { Component } from 'react'

export default class ErrorBoundary extends Component {
    state = { error: null }

    static getDerivedStateFromError(error) {
        return { error }
    }

    render() {
        if (this.state.error) {
            return (
                <pre style={{ padding: 24, color: '#f87171', whiteSpace: 'pre-wrap', fontSize: 14 }}>
                    {String(this.state.error.stack || this.state.error)}
                </pre>
            )
        }
        return this.props.children
    }
}