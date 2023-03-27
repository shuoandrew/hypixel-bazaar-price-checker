import './App.css';
import { useState, useEffect } from "react";

function App() {
  const [items, setItems] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedFilter, setSelectedFilter] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      const response = await fetch(
        "https://api.hypixel.net/skyblock/bazaar"
      );
      const data = await response.json();
      setItems(Object.values(data.products));
    };
    fetchData();
  }, []);

  const handleSearch = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleFilter = (event) => {
    setSelectedFilter(event.target.value);
  };

  const filteredItems = items.filter((item) =>
    item.product_id.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredItemsWithFilter = selectedFilter
    ? filteredItems.filter((item) => {
        const price = item.quick_status.buyPrice;
        switch (selectedFilter) {
          case "0-100":
            return price >= 0 && price <= 100;
          case "100-1000":
            return price > 100 && price <= 1000;
          case "1000-10000":
            return price > 1000 && price <= 10000;
          case "10000+":
            return price > 10000;
          default:
            return true;
        }
      })
    : filteredItems;

  const itemCount = filteredItemsWithFilter.length;
  const buyPriceSum = filteredItemsWithFilter.reduce(
    (total, item) => total + item.quick_status.buyPrice,
    0
  );
  const buyPriceAverage =
    filteredItemsWithFilter.length > 0
      ? buyPriceSum / filteredItemsWithFilter.length
      : 0;
  const buyPriceRange = `${(Math.min(
    ...filteredItemsWithFilter.map((item) => item.quick_status.buyPrice)
  )).toFixed(2)} - ${(Math.max(
    ...filteredItemsWithFilter.map((item) => item.quick_status.buyPrice)
  )).toFixed(2)}`;

  return (
    <div>
      <h1>Hypixel Skyblock Bazaar</h1>
      <input
        type="text"
        placeholder="Search items"
        value={searchTerm}
        onChange={handleSearch}
      />
      <select value={selectedFilter} onChange={handleFilter}>
        <option value="">Filter by price range</option>
        <option value="0-100">0-100 coins</option>
        <option value="100-1000">100-1000 coins</option>
        <option value="1000-10000">1000-10000 coins</option>
        <option value="10000+">10000+ coins</option>
      </select>
      <p id="stats">Total Items: {itemCount}</p>
      <p id="stats">Average Buy Price: {buyPriceAverage.toFixed(2)} coins</p>
      <p id="stats">Buy Price Range: {buyPriceRange} coins</p>
      <div className="list">
      <ul>
        {filteredItemsWithFilter.map((item) => (
          <li key={item.product_id}>
            <h3>
              {item.product_id
                .split("_")
                .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ")}
            </h3>
            <p>Buy Price: {item.quick_status.buyPrice.toFixed(2)} coins</p>
          </li>

        ))}
      </ul>
      </div>
    </div>
  );
}

export default App;
