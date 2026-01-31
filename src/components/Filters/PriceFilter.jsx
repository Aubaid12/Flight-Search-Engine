import { useState, useCallback, useEffect, useRef } from 'react';
import { DollarSign } from 'lucide-react';
import './PriceFilter.css';

export function PriceFilter({ value, range, onChange }) {
    const [localValue, setLocalValue] = useState(value);
    const [minPrice, maxPrice] = range;
    const sliderRef = useRef(null);

    useEffect(() => {
        setLocalValue(value);
    }, [value]);

    const handleMinChange = useCallback((e) => {
        const newMin = Math.min(Number(e.target.value), localValue[1] - 10);
        setLocalValue([newMin, localValue[1]]);
    }, [localValue]);

    const handleMaxChange = useCallback((e) => {
        const newMax = Math.max(Number(e.target.value), localValue[0] + 10);
        setLocalValue([localValue[0], newMax]);
    }, [localValue]);

    const handleMouseUp = useCallback(() => {
        onChange(localValue);
    }, [localValue, onChange]);

    // Calculate percentages for visual track
    const minPercent = ((localValue[0] - minPrice) / (maxPrice - minPrice)) * 100;
    const maxPercent = ((localValue[1] - minPrice) / (maxPrice - minPrice)) * 100;

    return (
        <div className="filter-section price-filter">
            <h3 className="filter-section-title">
                <DollarSign size={16} />
                Price Range
            </h3>

            <div className="price-values">
                <span className="price-amount">${localValue[0]}</span>
                <span className="price-dash">—</span>
                <span className="price-amount">${localValue[1]}</span>
            </div>

            <div className="dual-range-slider" ref={sliderRef}>
                {/* Background track */}
                <div className="slider-bg-track"></div>

                {/* Active range highlight */}
                <div
                    className="slider-active-track"
                    style={{
                        left: `${minPercent}%`,
                        width: `${maxPercent - minPercent}%`
                    }}
                ></div>

                {/* Min thumb */}
                <input
                    type="range"
                    className="thumb thumb-left"
                    min={minPrice}
                    max={maxPrice}
                    value={localValue[0]}
                    onChange={handleMinChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                />

                {/* Max thumb */}
                <input
                    type="range"
                    className="thumb thumb-right"
                    min={minPrice}
                    max={maxPrice}
                    value={localValue[1]}
                    onChange={handleMaxChange}
                    onMouseUp={handleMouseUp}
                    onTouchEnd={handleMouseUp}
                />
            </div>

            <div className="price-bounds">
                <span>${minPrice}</span>
                <span>${maxPrice}</span>
            </div>
        </div>
    );
}
