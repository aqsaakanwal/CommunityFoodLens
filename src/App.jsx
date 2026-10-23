
import { useMemo, useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { pbsData, pbsSource } from "./pbsData";
import "./App.css";

// City-level prices supplied for nine selected food items.
const cityPrices = [
  {
    item: "Wheat Flour Bag",
    prices: {
      Islamabad: 3286.54,
      Lahore: 2477.84,
      Karachi: 3412.18,
      Peshawar: 3038.96,
      Multan: 2418.34,
      Quetta: 3164.99,
      "National Average": 2976.12,
    },
  },
  {
    item: "Rice Basmati Broken",
    prices: {
      Islamabad: 274.83,
      Lahore: 228.47,
      Karachi: 283.54,
      Peshawar: 222.18,
      Multan: 193.1,
      Quetta: 279.93,
      "National Average": 214.76,
    },
  },
  {
    item: "Plain Bread",
    prices: {
      Islamabad: 120,
      Lahore: 130,
      Karachi: 140,
      Peshawar: 120,
      Multan: 130,
      Quetta: 130,
      "National Average": 122.04,
    },
  },
  {
    item: "Beef with Bone",
    prices: {
      Islamabad: 1491.13,
      Lahore: 1295.92,
      Karachi: 1470.13,
      Peshawar: 1274.41,
      Multan: 1299.79,
      Quetta: 1274.1,
      "National Average": 1279.62,
    },
  },
  {
    item: "Mutton",
    prices: {
      Islamabad: 2853.49,
      Lahore: 2928.23,
      Karachi: 2566.08,
      Peshawar: 2347.75,
      Multan: 2488.69,
      Quetta: 2348.05,
      "National Average": 2401.65,
    },
  },
  {
    item: "Live Broiler Chicken",
    prices: {
      Islamabad: 437.94,
      Lahore: 398,
      Karachi: 510.23,
      Peshawar: 440,
      Multan: 440,
      Quetta: 439.96,
      "National Average": 444.27,
    },
  },
  {
    item: "Fresh Milk",
    prices: {
      Islamabad: 256.56,
      Lahore: 212.79,
      Karachi: 240,
      Peshawar: 266.46,
      Multan: 209.95,
      Quetta: 220,
      "National Average": 218.92,
    },
  },
  {
    item: "Farm Eggs",
    prices: {
      Islamabad: 269.67,
      Lahore: 267,
      Karachi: 273.45,
      Peshawar: 276.58,
      Multan: 252.74,
      Quetta: 251.57,
      "National Average": 261.86,
    },
  },
  {
    item: "Washed Masoor Dal",
    prices: {
      Islamabad: 308.94,
      Lahore: 245.19,
      Karachi: 278.24,
      Peshawar: 266.5,
      Multan: 295.51,
      Quetta: 309.93,
      "National Average": 268.46,
    },
  },
];

const cities = [
  "Lahore",
  "Islamabad",
  "Karachi",
  "Peshawar",
  "Multan",
  "Quetta",
];

const money = (value) =>
  `Rs ${Number(value).toLocaleString("en-PK", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const normalize = (value) =>
  value.toLowerCase().replace(/[^a-z0-9]/g, "");

function SectionHeading({ number, label, title, description }) {
  return (
    <div className="section-heading">
      <p className="eyebrow">
        {number} · {label}
      </p>
      <h2>{title}</h2>
      <p>{description}</p>
    </div>
  );
}

// 01 — PBS national prices and selected city comparisons.
function FoodPriceComparison() {
  const [city, setCity] = useState("Lahore");
  const [selectedItem, setSelectedItem] = useState(1);
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("name");

  const filteredItems = useMemo(() => {
    const filtered = pbsData.filter((entry) =>
      entry.item.toLowerCase().includes(search.trim().toLowerCase())
    );

    return [...filtered].sort((a, b) => {
      if (sort === "high") return b.avg - a.avg;
      if (sort === "low") return a.avg - b.avg;
      return a.item.localeCompare(b.item);
    });
  }, [search, sort]);

  const selected =
    pbsData.find((entry) => entry.id === selectedItem) ?? pbsData[0];

  const matchedCityItem = cityPrices.find(
    (entry) =>
      normalize(entry.item) === normalize(selected.item) ||
      (selected.id === 7 &&
        normalize(entry.item) === normalize("Live Broiler Chicken")) ||
      (selected.id === 11 &&
        normalize(entry.item) === normalize("Farm Eggs")) ||
      (selected.id === 17 &&
        normalize(entry.item) === normalize("Washed Masoor Dal"))
  );

  const cityChartData = matchedCityItem
    ? cities.map((name) => ({
        city: name,
        price: matchedCityItem.prices[name],
      }))
    : [];

  return (
    <section className="platform-section" id="price-comparison">
      <SectionHeading
        number="01"
        label="OFFICIAL PRICE DATA"
        title="Explore essential food prices."
        description="Search 20 essential food items, explore reported national price ranges, and compare selected cities where supplied values are available."
      />

      <p className="demo-note">
        Report date: {pbsSource.date}. Values are manually transcribed,
        not live-updating.
      </p>

      <div className="explorer-toolbar">
        <label htmlFor="price-search">Search food items</label>
        <input
          id="price-search"
          type="search"
          placeholder="Search flour, milk, rice, eggs..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />

        <label htmlFor="price-sort">Sort prices</label>
        <select
          id="price-sort"
          value={sort}
          onChange={(event) => setSort(event.target.value)}
        >
          <option value="name">Food name</option>
          <option value="high">Highest average price</option>
          <option value="low">Lowest average price</option>
        </select>
      </div>

      <div className="feature-grid">
        {filteredItems.map((entry) => (
          <button
            type="button"
            key={entry.id}
            onClick={() => setSelectedItem(entry.id)}
            aria-pressed={selectedItem === entry.id}
            style={{
              textAlign: "left",
              font: "inherit",
              cursor: "pointer",
              border:
                selectedItem === entry.id
                  ? "2px solid #8065bd"
                  : "1px solid #e9e2f4",
              borderRadius: 18,
              padding: 20,
              background:
                selectedItem === entry.id ? "#f4efff" : "#ffffff",
              color: "#39304f",
              minWidth: 0,
            }}
          >
            <span style={{ fontSize: 12, color: "#8065bd" }}>
              {selectedItem === entry.id ? "SELECTED ITEM" : "PBS PRICE"}
            </span>
            <h3 style={{ margin: "12px 0 8px" }}>{entry.item}</h3>
            <p style={{ color: "#766e88", fontSize: 13 }}>
              Unit: {entry.unit}
            </p>
            <div
              style={{
                fontSize: 23,
                fontWeight: 800,
                color: "#4c387c",
                marginTop: 12,
              }}
            >
              {money(entry.avg)}
            </div>
            <p style={{ color: "#766e88", fontSize: 12 }}>
              National average
            </p>
            <p
              style={{
                fontSize: 13,
                color: entry.weeklyChange > 0 ? "#c2415d" : "#21845b",
              }}
            >
              Weekly: {entry.weeklyChange > 0 ? "+" : ""}
              {entry.weeklyChange.toFixed(2)}%
            </p>
            <p
              style={{
                fontSize: 13,
                color: entry.yearlyChange > 0 ? "#c2415d" : "#21845b",
              }}
            >
              Yearly: {entry.yearlyChange > 0 ? "+" : ""}
              {entry.yearlyChange.toFixed(2)}%
            </p>
          </button>
        ))}
      </div>

      {filteredItems.length === 0 && (
        <article className="feature-card">
          <h3>No matching food items</h3>
          <p>Try another search term.</p>
          <button type="button" onClick={() => setSearch("")}>
            Clear search
          </button>
        </article>
      )}

      <article className="feature-card" style={{ marginTop: 28 }}>
        <p className="eyebrow">NATIONAL PRICE RANGE</p>
        <h3>{selected.item}</h3>
        <p>Unit: {selected.unit}</p>

        <div className="feature-grid" style={{ marginTop: 18 }}>
          {[
            { label: "Minimum reported price", value: selected.min },
            { label: "National average", value: selected.avg },
            { label: "Maximum reported price", value: selected.max },
          ].map((metric) => (
            <div
              key={metric.label}
              className="feature-card"
              style={{ minWidth: 0, background: "#f8f5ff" }}
            >
              <p>{metric.label}</p>
              <h3>{money(metric.value)}</h3>
            </div>
          ))}
        </div>

        <div className="feature-grid" style={{ marginTop: 18 }}>
          <div className="feature-card" style={{ minWidth: 0 }}>
            <p>Change from previous week</p>
            <h3 style={{ color: selected.weeklyChange > 0 ? "#c2415d" : "#21845b" }}>
              {selected.weeklyChange > 0 ? "+" : ""}
              {selected.weeklyChange.toFixed(2)}%
            </h3>
          </div>
          <div className="feature-card" style={{ minWidth: 0 }}>
            <p>Change from same week last year</p>
            <h3 style={{ color: selected.yearlyChange > 0 ? "#c2415d" : "#21845b" }}>
              {selected.yearlyChange > 0 ? "+" : ""}
              {selected.yearlyChange.toFixed(2)}%
            </h3>
          </div>
        </div>
      </article>

      <article className="feature-card" style={{ marginTop: 28 }}>
        <p className="eyebrow">CITY COMPARISON</p>
        <h3>{selected.item}</h3>

        {matchedCityItem ? (
          <>
            <div className="explorer-toolbar">
              <label htmlFor="price-city">Choose city</label>
              <select
                id="price-city"
                value={city}
                onChange={(event) => setCity(event.target.value)}
              >
                {cities.map((name) => (
                  <option key={name}>{name}</option>
                ))}
              </select>
            </div>

            <div style={{ width: "100%", height: 310, marginTop: 18 }}>
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={cityChartData}
                  margin={{ top: 10, right: 10, left: 5, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis dataKey="city" tick={{ fontSize: 11 }} />
                  <YAxis tickFormatter={(value) => value.toLocaleString()} />
                  <Tooltip formatter={(value) => [money(value), "Price"]} />
                  <Bar
                    dataKey="price"
                    name="Price"
                    fill="#8B72D9"
                    radius={[7, 7, 0, 0]}
                  />
                </BarChart>
              </ResponsiveContainer>
            </div>

            <div className="feature-card" style={{ background: "#f3effb" }}>
              <p className="eyebrow">SELECTED CITY</p>
              <h3>{city}</h3>
              <h2 style={{ color: "#7258b8" }}>
                {money(matchedCityItem.prices[city])}
              </h2>
              <p>
                National average: <strong>{money(selected.avg)}</strong>
              </p>
            </div>
          </>
        ) : (
          <div className="feature-card" style={{ background: "#f3effb" }}>
            <p>
              City-level values were not included for this item in the
              supplied nine-item city dataset.
            </p>
            <p>
              National average: <strong>{money(selected.avg)}</strong>
            </p>
            <p>Missing city prices are not estimated or invented.</p>
          </div>
        )}
      </article>

      <p className="demo-note">
        Source: {pbsSource.organization}, {pbsSource.report}. Verify the
        manually transcribed values against the original PBS report before
        formal research use.
      </p>
    </section>
  );
}

// 02 — Illustrative community data explorer.
const researchData = [
  { area: "Area A", access: 78, affordability: 72 },
  { area: "Area B", access: 65, affordability: 58 },
  { area: "Area C", access: 84, affordability: 76 },
  { area: "Area D", access: 52, affordability: 49 },
  { area: "Area E", access: 71, affordability: 64 },
  { area: "Area F", access: 60, affordability: 55 },
];

function DataExplorer() {
  const [selectedArea, setSelectedArea] = useState("All Areas");

  const visibleAreas =
    selectedArea === "All Areas"
      ? researchData
      : researchData.filter((area) => area.area === selectedArea);

  return (
    <section className="platform-section" id="data-explorer">
      <SectionHeading
        number="02"
        label="DATA EXPLORER"
        title="Explore community food access."
        description="Filter sample areas and explore illustrative food-access and affordability indicators."
      />

      <div className="explorer-toolbar">
        <label htmlFor="area-filter">Choose an area</label>
        <select
          id="area-filter"
          value={selectedArea}
          onChange={(event) => setSelectedArea(event.target.value)}
        >
          <option>All Areas</option>
          {researchData.map((area) => (
            <option key={area.area}>{area.area}</option>
          ))}
        </select>
      </div>

      <div className="feature-grid">
        {visibleAreas.map((area) => (
          <article className="feature-card" key={area.area}>
            <p className="eyebrow">{area.area}</p>
            <h3>Food Access</h3>
            <p>{area.access}/100</p>
            <div className="progress-track">
              <div
                className="progress-fill"
                style={{ width: `${area.access}%` }}
              />
            </div>

            <h3 style={{ marginTop: 18 }}>Affordability</h3>
            <p>{area.affordability}/100</p>
            <div className="progress-track">
              <div
                className="progress-fill affordability-fill"
                style={{ width: `${area.affordability}%` }}
              />
            </div>
          </article>
        ))}
      </div>

      <p className="demo-note">
        Area names and scores are fictional demonstration data, not
        measured community statistics.
      </p>
    </section>
  );
}

// 03 — Charts and summary metrics for sample data.
function ResearchAnalytics() {
  const averageAccess = Math.round(
    researchData.reduce((sum, area) => sum + area.access, 0) /
      researchData.length
  );

  const averageAffordability = Math.round(
    researchData.reduce((sum, area) => sum + area.affordability, 0) /
      researchData.length
  );

  return (
    <section className="platform-section" id="research-analytics">
      <SectionHeading
        number="03"
        label="RESEARCH ANALYTICS"
        title="See the bigger picture."
        description="Compare sample indicators and develop questions for future community food research."
      />

      <div className="feature-grid">
        <article className="feature-card">
          <p>Sample areas</p>
          <h3>{researchData.length}</h3>
        </article>
        <article className="feature-card">
          <p>Average food access</p>
          <h3>{averageAccess}/100</h3>
        </article>
        <article className="feature-card">
          <p>Average affordability</p>
          <h3>{averageAffordability}/100</h3>
        </article>
        <article className="feature-card">
          <p>Indicators explored</p>
          <h3>2</h3>
        </article>
      </div>

      <article className="feature-card" style={{ marginTop: 24 }}>
        <h3>Food access by sample area</h3>
        <div style={{ width: "100%", height: 300, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={researchData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="access"
                name="Food access score"
                fill="#8B72D9"
                radius={[7, 7, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <article className="feature-card" style={{ marginTop: 24 }}>
        <h3>Food access vs. affordability</h3>
        <div style={{ width: "100%", height: 300, marginTop: 16 }}>
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={researchData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} />
              <XAxis dataKey="area" />
              <YAxis domain={[0, 100]} />
              <Tooltip />
              <Bar
                dataKey="access"
                name="Food access"
                fill="#8B72D9"
                radius={[6, 6, 0, 0]}
              />
              <Bar
                dataKey="affordability"
                name="Affordability"
                fill="#58B99B"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </article>

      <p className="demo-note">
        These charts use fictional sample scores. They are separate from
        the official PBS food-price dataset and do not represent real
        community measurements.
      </p>
    </section>
  );
}

// 04 — Community project idea generator.
function IdeaPlanner() {
  const [goal, setGoal] = useState("nutrition");
  const [audience, setAudience] = useState("families");
  const [showPlan, setShowPlan] = useState(false);

  const plans = {
    nutrition: {
      title: "Community Nutrition Workshop",
      description:
        "Prepare a simple workshop about balanced meals and practical nutrition.",
      tasks: [
        "Choose three nutrition topics",
        "Prepare a balanced-meal guide",
        "Collect participant feedback",
      ],
    },
    affordability: {
      title: "Budget-Friendly Meal Guide",
      description:
        "Explore meal ideas using affordable, locally available ingredients.",
      tasks: [
        "Select locally available ingredients",
        "Draft a weekly meal plan",
        "Check prices against reliable local sources",
      ],
    },
    awareness: {
      title: "Food Access Awareness",
      description:
        "Create educational materials about food access and safe food storage.",
      tasks: [
        "Choose an awareness topic",
        "Prepare an educational poster",
        "Ask the intended audience for feedback",
      ],
    },
  };

  const plan = plans[goal];

  return (
    <section className="platform-section" id="idea-planner">
      <SectionHeading
        number="04"
        label="IDEA PLANNER"
        title="Turn insights into ideas."
        description="Build a starter plan for a possible community initiative."
      />

      <div className="feature-card" style={{ maxWidth: 760 }}>
        <label htmlFor="planner-goal">Choose a goal</label>
        <select
          id="planner-goal"
          value={goal}
          onChange={(event) => {
            setGoal(event.target.value);
            setShowPlan(false);
          }}
        >
          <option value="nutrition">Nutrition education</option>
          <option value="affordability">Affordable food</option>
          <option value="awareness">Community awareness</option>
        </select>

        <label htmlFor="planner-audience" style={{ marginTop: 18 }}>
          Intended audience
        </label>
        <select
          id="planner-audience"
          value={audience}
          onChange={(event) => {
            setAudience(event.target.value);
            setShowPlan(false);
          }}
        >
          <option value="families">Families</option>
          <option value="students">Students</option>
          <option value="older adults">Older adults</option>
          <option value="community members">General community</option>
        </select>

        <button
          type="button"
          style={{
            marginTop: 22,
            padding: "12px 18px",
            border: 0,
            borderRadius: 12,
            background: "#8065bd",
            color: "#fff",
            fontWeight: 700,
            cursor: "pointer",
          }}
          onClick={() => setShowPlan(true)}
        >
          Generate starter plan
        </button>

        {showPlan && (
          <div
            aria-live="polite"
            style={{
              marginTop: 24,
              padding: 20,
              borderRadius: 15,
              background: "#f3effb",
            }}
          >
            <p className="eyebrow">YOUR PLAN</p>
            <h3>{plan.title}</h3>
            <p>{plan.description}</p>
            <p>
              <strong>Audience:</strong> {audience}
            </p>
            <ul style={{ lineHeight: 1.9 }}>
              {plan.tasks.map((task) => (
                <li key={task}>{task}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <p className="demo-note">
        Suggested ideas only; these are not evaluated interventions or
        established research findings.
      </p>
    </section>
  );
}

export default function App() {
  return (
    <>
      <header className="site-header">
        <a className="logo" href="#top">
          CommunityFoodLens
        </a>

        <nav aria-label="Main navigation">
          <a href="#price-comparison">Food Prices</a>
          <a href="#data-explorer">Data Explorer</a>
          <a href="#research-analytics">Research Analytics</a>
          <a href="#idea-planner">Idea Planner</a>
        </nav>
      </header>

      <main id="top">
        <section className="hero-section">
          <p className="eyebrow">COMMUNITY FOOD RESEARCH</p>
          <h1>Understand food prices across communities.</h1>
          <p>
            Explore reported prices, compare selected cities, and investigate
            questions about food affordability, food access, and nutrition.
          </p>
          <a className="primary-button" href="#price-comparison">
            Explore food prices →
          </a>
        </section>

        <FoodPriceComparison />
        <DataExplorer />
        <ResearchAnalytics />
        <IdeaPlanner />
      </main>

      <footer className="site-footer">
        CommunityFoodLens · Food-price research prototype.
        <br />
        Source: {pbsSource.organization}, {pbsSource.report}, dated{" "}
        {pbsSource.date}. Selected values were manually transcribed.
      </footer>
    </>
  );
}
