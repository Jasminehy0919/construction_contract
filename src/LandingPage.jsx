import './LandingPage.css'

export function LandingPage({ onSelect }) {
  return (
    <div className="landing">
      <div className="landing-hero">
        <h1 className="landing-logo">Zero Construction</h1>
        <p className="landing-tagline">What would you like to create?</p>
      </div>

      <div className="landing-cards">
        <button
          type="button"
          className="landing-card"
          onClick={() => onSelect('quote')}
        >
          <div className="landing-card-icon">📋</div>
          <h2>Quote</h2>
          <p>Create a project estimate for your client. Simple pricing breakdown with optional items.</p>
          <span className="landing-card-cta">Get started →</span>
        </button>

        <button
          type="button"
          className="landing-card"
          onClick={() => onSelect('contract')}
        >
          <div className="landing-card-icon">📄</div>
          <h2>Generate Contract</h2>
          <p>Full construction contract with warranty, payment terms, and legal agreement.</p>
          <span className="landing-card-cta">Get started →</span>
        </button>
      </div>
    </div>
  )
}
