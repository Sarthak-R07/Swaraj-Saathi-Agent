import React from 'react';

export default class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null, errorInfo: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  componentDidCatch(error, errorInfo) {
    console.error('Swaraj Saathi Caught Error:', error, errorInfo);
    this.setState({ errorInfo });
  }

  render() {
    if (this.state.hasError) {
      return (
        <div style={{
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: '#0F172A',
          color: '#F8FAFC',
          fontFamily: 'system-ui, -apple-system, sans-serif',
          padding: '24px'
        }}>
          <div style={{
            maxWidth: '600px',
            width: '100%',
            backgroundColor: '#1E293B',
            borderRadius: '16px',
            padding: '32px',
            border: '1px solid #334155',
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                backgroundColor: 'rgba(239, 68, 68, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#EF4444',
                fontWeight: 'bold',
                fontSize: '20px'
              }}>!</div>
              <h1 style={{ fontSize: '20px', fontWeight: 'bold', margin: 0, color: '#F1F5F9' }}>
                Swaraj Saathi Application Notice
              </h1>
            </div>

            <p style={{ color: '#94A3B8', fontSize: '14px', lineHeight: '1.6', marginBottom: '20px' }}>
              The portal encountered an initialization state. Click the button below to reload cleanly:
            </p>

            {this.state.error && (
              <pre style={{
                backgroundColor: '#0F172A',
                padding: '12px',
                borderRadius: '8px',
                color: '#F87171',
                fontSize: '12px',
                overflowX: 'auto',
                marginBottom: '20px',
                border: '1px solid #334155'
              }}>
                {this.state.error.toString()}
              </pre>
            )}

            <button
              onClick={() => {
                localStorage.clear();
                window.location.reload();
              }}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: '#FF7A00',
                color: '#FFFFFF',
                border: 'none',
                borderRadius: '10px',
                fontWeight: 'bold',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              🔄 Clear Cache & Reload Dashboard
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
