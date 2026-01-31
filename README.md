# Flight Search Engine

A modern, responsive flight search application built with **React** and **Vite**, integrated with the **Amadeus API** for real-time flight data.

![Flight Search Engine Preview](./public/preview.png)

## 🚀 Features

- **Real-time Search**: Search for flights globally using the Amadeus API.
- **Smart Filtering**: Filter results by price, airline, stops, and departure time.
- **Price Insights**: Visualize price trends with an interactive graph.
- **Responsive Design**: Fully responsive interface that works seamlessly on desktop and mobile.
- **Dark Mode**: Toggle between light and dark themes for better accessibility.
- **Passenger Selection**: Easy-to-use interface for selecting adults, children, and infants.
- **Booking Simulation**: Realistic booking flow with a confirmation page.

## 🛠️ Tech Stack

- **Frontend**: React 19, Vite
- **Routing**: React Router DOM 7
- **Icons**: Lucide React
- **Charts**: Recharts
- **Date Handling**: date-fns, react-datepicker
- **Styling**: Native CSS with CSS Variables for theming

## 📦 Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (v18 or higher)
- npm or yarn

You will also need an **Amadeus API** account to get your credentials.
1. Sign up at [Amadeus for Developers](https://developers.amadeus.com/).
2. Create a new app to generate your `API Key` and `API Secret`.

## ⚡ Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/flight-search-engine.git
   cd flight-search-engine
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Configure Environment Variables**
   Create a `.env` file in the root directory based on the example:
   ```bash
   cp .env.example .env
   ```
   
   Open `.env` and add your Amadeus credentials:
   ```env
   VITE_AMADEUS_API_KEY=your_actual_api_key
   VITE_AMADEUS_API_SECRET=your_actual_api_secret
   ```

4. **Run the Development Server**
   ```bash
   npm run dev
   ```

   The app will be available at `http://localhost:5173`.

## 📁 Project Structure

```
src/
├── components/       # Reusable UI components
│   ├── Filters/      # Filter panel components
│   ├── FlightResults/# Flight card and list components
│   ├── SearchForm/   # Search inputs and logic
│   └── ...
├── hooks/            # Custom React hooks (useFlightSearch, useFilters)
├── pages/            # Page components (Home, BookingSuccess)
├── services/         # API integration (amadeus.js)
├── App.jsx           # Main application layout and routing
└── index.css         # Global styles and theme variables
```

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License.
