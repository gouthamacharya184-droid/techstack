import React from 'react';

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Application Error Caught by Boundary:', error, errorInfo);
  }

  handleReload = () => {
    this.setState({ hasError: false, error: null });
    window.location.reload();
  };

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            minHeight: '100vh',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#03020a',
            color: '#f0e6d0',
            fontFamily: "'Cormorant Garamond', serif",
            padding: '2rem',
            textAlign: 'center',
          }}
        >
          <div style={{ fontSize: '3rem', marginBottom: '1rem', color: '#e8b84b' }}>✦</div>
          <h1
            style={{
              fontFamily: "'Playfair Display', serif",
              fontSize: '2rem',
              color: '#f5d07a',
              marginBottom: '1rem',
              fontWeight: 700,
            }}
          >
            A Momentary Pause in the Story
          </h1>
          <p
            style={{
              maxWidth: '500px',
              lineHeight: 1.8,
              color: 'rgba(240, 230, 208, 0.75)',
              marginBottom: '2rem',
              fontSize: '1.1rem',
            }}
          >
            An unexpected glitch occurred while rendering this scene. Don't worry — all your memories and wishes are safe.
          </p>
          <button
            onClick={this.handleReload}
            style={{
              padding: '0.75rem 2rem',
              background: 'transparent',
              border: '1px solid #e8b84b',
              color: '#f5d07a',
              fontFamily: "'Cormorant Garamond', serif",
              fontSize: '0.9rem',
              letterSpacing: '0.3em',
              textTransform: 'uppercase',
              cursor: 'pointer',
              borderRadius: '2px',
              transition: 'all 0.3s',
            }}
          >
            ✦ Reload Experience ✦
          </button>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
