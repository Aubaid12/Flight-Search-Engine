import { useState, useRef, useEffect, useCallback } from 'react';
import { createPortal } from 'react-dom';
import DatePicker from 'react-datepicker';
import { Calendar, ChevronLeft, ChevronRight } from 'lucide-react';
import { addDays, format } from 'date-fns';
import 'react-datepicker/dist/react-datepicker.css';
import './DatePickerCustom.css';

export function CustomDatePicker({
    label,
    value,
    onChange,
    minDate,
    disabled = false
}) {
    const [isOpen, setIsOpen] = useState(false);
    const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
    const inputRef = useRef(null);

    // Helper to get local date at midnight
    const getLocalDate = (dateStr) => {
        if (!dateStr) return null;
        const date = new Date(dateStr);
        return new Date(date.getFullYear(), date.getMonth(), date.getDate());
    };

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const effectiveMinDate = minDate ? getLocalDate(minDate) : today;
    const maxDate = addDays(today, 365);

    // Convert string date to Date object (local midnight)
    const selectedDate = getLocalDate(value);

    // Calculate position when opening
    const updatePosition = useCallback(() => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setDropdownPosition({
                top: rect.bottom + 8,
                left: rect.left
            });
        }
    }, []);

    useEffect(() => {
        if (isOpen) {
            updatePosition();
            window.addEventListener('scroll', updatePosition, true);
            window.addEventListener('resize', updatePosition);
            return () => {
                window.removeEventListener('scroll', updatePosition, true);
                window.removeEventListener('resize', updatePosition);
            };
        }
    }, [isOpen, updatePosition]);

    const handleChange = (date) => {
        if (date) {
            onChange(format(date, 'yyyy-MM-dd'));
        }
        setIsOpen(false);
    };

    const toggleCalendar = () => {
        if (!disabled) {
            setIsOpen(!isOpen);
        }
    };

    const CustomHeader = ({
        date,
        decreaseMonth,
        increaseMonth,
        prevMonthButtonDisabled,
        nextMonthButtonDisabled,
    }) => (
        <div className="custom-header">
            <button
                onClick={decreaseMonth}
                disabled={prevMonthButtonDisabled}
                className="nav-btn"
                type="button"
            >
                <ChevronLeft size={20} />
            </button>
            <span className="current-month">
                {format(date, 'MMMM yyyy')}
            </span>
            <button
                onClick={increaseMonth}
                disabled={nextMonthButtonDisabled}
                className="nav-btn"
                type="button"
            >
                <ChevronRight size={20} />
            </button>
        </div>
    );

    // Format displayed date
    const displayValue = selectedDate
        ? format(selectedDate, 'dd-MM-yyyy')
        : 'Select date';

    return (
        <div className="datepicker-container">
            <div className={`date-picker ${disabled ? 'disabled' : ''}`} ref={inputRef}>
                <label className="date-label">{label}</label>
                <div className="date-input-wrapper" onClick={toggleCalendar}>
                    <Calendar size={20} className="date-icon" />
                    <div className="date-input">
                        {displayValue}
                    </div>
                </div>
            </div>

            {isOpen && createPortal(
                <>
                    <div className="calendar-backdrop" onClick={() => setIsOpen(false)} />
                    <div
                        className="calendar-dropdown"
                        style={{
                            position: 'fixed',
                            top: dropdownPosition.top,
                            left: dropdownPosition.left,
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <DatePicker
                            selected={selectedDate}
                            onChange={handleChange}
                            minDate={effectiveMinDate}
                            maxDate={maxDate}
                            inline
                            renderCustomHeader={CustomHeader}
                            calendarClassName="custom-calendar"
                            dayClassName={(date) =>
                                date.getTime() === selectedDate?.getTime() ? 'selected-day' : ''
                            }
                            formatWeekDay={(nameOfDay) => nameOfDay.substring(0, 3)}
                        />
                    </div>
                </>,
                document.body
            )}
        </div>
    );
}

// Keep the old DatePicker as a named export for compatibility
export { CustomDatePicker as DatePicker };
