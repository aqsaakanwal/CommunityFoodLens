
import { useState } from "react";

const sampleData = [
  { area: "Area A", access: "High", affordability: 4 },
  { area: "Area B", access: "Medium", affordability: 3 },
  { area: "Area C", access: "Low", affordability: 2 },
  { area: "Area D", access: "High", affordability: 5 },
  { area: "Area E", access: "Low", affordability: 1 },
];

export default function DataExplorer() {
  const [filter, setFilter] = useState("All");

  const filteredData =
    filter === "All"
      ? sampleData
      : sampleData.filter((item) => item.access === filter);

  return (
    <section className="platform-section" id="data-explorer">
      <p className="eyebrow">INTERACTIVE DEMO</p>
      <h2>Explore food access</h2>
      <p>
        Explore a small illustrative dataset. These values are fictional,
        not real community research findings.
      </p>

      <label htmlFor="access-filter">Filter by access level: </label>
      <select
        id="access-filter"
        value={filter}
        onChange={(event) => setFilter(event.target.value)}
      >
        <option>All</option>
        <option>High</option>
        <option>Medium</option>
        <option>Low</option>
      </select>

      <div className="feature-grid">
        {filteredData.map((item) => (
          <article className="feature-card" key={item.area}>
            <p>{item.area}</p>
            <h3>{item.access} access</h3>
            <p>Illustrative affordability score</p>
            <strong>{item.affordability} / 5</strong>
          </article>
        ))}
      </div>

      <p>{filteredData.length} sample areas displayed</p>
    </section>
  );
}
