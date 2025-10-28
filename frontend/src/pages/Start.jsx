import { Link } from "react-router-dom";
import "../styles/start.css";

function Start() {
    return (
        <main className="start-page">
            <div className="start-card">
                <h1 className="start-title">Welcome to Preptrack CBT</h1>
                <p className="start-subtitle">Take a timed assessment to evaluate your current level and get instant feedback.</p>

                <ul className="start-features" aria-hidden>
                    <li>Timed mock tests</li>
                    <li>Instant scoring</li>
                    <li>Progress tracking</li>
                </ul>

                <Link to="/assessment" className="start-btn" aria-label="Start assessment">
                    Start Assessment
                </Link>

                <p className="start-note">Tip: You can review results and track progress after each test.</p>
            </div>
        </main>
    );
}

export default Start;