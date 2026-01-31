import { Plane } from 'lucide-react';
import './LoadingAnimation.css';

export function LoadingAnimation() {
    return (
        <div className="loading-animation">
            <div className="loading-illustration">
                <div className="clouds">
                    <div className="cloud cloud-1" />
                    <div className="cloud cloud-2" />
                    <div className="cloud cloud-3" />
                </div>
                <div className="plane-container">
                    <Plane size={48} className="flying-plane" />
                </div>
                <div className="trail" />
            </div>
            <h3 className="loading-title">Searching flights...</h3>
            <p className="loading-subtitle">Finding the best deals for you</p>
            <div className="loading-dots">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
            </div>
        </div>
    );
}
