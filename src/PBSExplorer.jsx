
import { useState } from "react";
import { pbsData, pbsSource } from "./pbsData";

export default function PBSExplorer() {
  const [search, setSearch] = useState("");

  const filteredItems = pbsData.filter((entry) =>
    entry.item.toLowerCase().includes(search.toLowerCase())
  );

  const formatPrice = (price) =>
    `Rs. ${Number(price).toLocaleString("en-PK", {
      maximumFractionDigits: 2,
    })}`;

  const cardStyle = {
    background: "#ffffff",
    border: "1px solid #e8e1f5",
    borderRadius: "14px",
    padding: "18px",
    flex: "1 1 180px",
  };

  return (
    <section style={{ padding: "28px 0", color: "#30264a" }}>
      <div style={{ marginBottom: "20px" }}>
        <p style={{ color: "#7863a8", fontWeight: 700 }}>
          OFFICIAL DATA SOURCE
        </p>
        <h2>Pakistan Food Price Explorer</h2>
        <p>
          Explore essential food prices reported by the Pakistan Bureau
          of Statistics.
        </p>
        <p style={{ fontSize: "13px", color: "#777" }}>
          Report date: {pbsSource.date} · {pbsSource.report}
        </p>
      </div>

      <div style={{ display: "flex", flexWrap: "wrap", gap: "14px" }}>
        <div style={cardStyle}>
          <p>Food items</p>
          <h2>{pbsData.length}</h2>
        </div>
        <div style={cardStyle}>
          <p>Highest average price</p>
          <h2>{formatPrice(Math.max(...pbsData.map((x) => x.avg)))}</h2>
          <small>
            {pbsData.find(
              (x) => x.avg === Math.max(...pbsData.map((y) => y.avg))
            )?.item}
          </small>
        </div>
        <div style={cardStyle}>
          <p>Largest weekly increase</p>
          <h2>
            {Math.max(...pbsData.map((x) => x.weeklyChange)).toFixed(2)}%
          </h2>
          <small>
            {pbsData.find(
              (x) =>
                x.weeklyChange ===
                Math.max(...pbsData.map((y) => y.weeklyChange))
            )?.item}
          </small>
        </div>
      </div>

      <div style={{ margin: "24px 0 14px" }}>
        <input
          type="text"
          placeholder="Search a food item..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            maxWidth: "420px",
            padding: "12px",
            border: "1px solid #d8ccec",
            borderRadius: "10px",
            fontSize: "15px",
          }}
        />
      </div>

      <div style={{ overflowX: "auto", background: "#fff", borderRadius: "12px" }}>
        <table
          style={{
            width: "100%",
            borderCollapse: "collapse",
            minWidth: "720px",
          }}
        >
          <thead style={{ background: "#eee8fa" }}>
            <tr>
              {[
                "Food item",
                "Unit",
                "Minimum price",
                "Average price",
                "Maximum price",
                "Weekly change",
                "Yearly change",
              ].map((heading) => (
                <th
                  key={heading}
                  style={{ padding: "13px", textAlign: "left" }}
                >
                  {heading}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filteredItems.map((entry) => (
              <tr key={entry.id} style={{ borderBottom: "1px solid #eee" }}>
                <td style={{ padding: "12px" }}>{entry.item}</td>
                <td style={{ padding: "12px" }}>{entry.unit}</td>
                <td style={{ padding: "12px" }}>{formatPrice(entry.min)}</td>
                <td style={{ padding: "12px", fontWeight: 700 }}>
                  {formatPrice(entry.avg)}
                </td>
                <td style={{ padding: "12px" }}>{formatPrice(entry.max)}</td>
                <td
                  style={{
                    padding: "12px",
                    color: entry.weeklyChange > 0 ? "#c2415d" : "#21845b",
                  }}
                >
                  {entry.weeklyChange > 0 ? "+" : ""}
                  {entry.weeklyChange.toFixed(2)}%
                </td>
                <td
                  style={{
                    padding: "12px",
                    color: entry.yearlyChange > 0 ? "#c2415d" : "#21845b",
                  }}
                >
                  {entry.yearlyChange > 0 ? "+" : ""}
                  {entry.yearlyChange.toFixed(2)}%
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredItems.length === 0 && (
          <p style={{ padding: "20px" }}>No matching food items found.</p>
        )}
      </div>

      <p style={{ fontSize: "12px", color: "#777", marginTop: "14px" }}>
        Source: {pbsSource.organization}. Values are transcribed from the
        supplied report; please verify them against the original publication
        before using them for formal research.
      </p>
    </section>
  );
}
