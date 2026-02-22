function FilterPanel({ filters, onChange }) {
  function updateField(field, value) {
    onChange((prev) => ({ ...prev, [field]: value }));
  }

  return (
    <section className="card filter-grid">
      <label>
        Start Date
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => updateField("startDate", e.target.value)}
        />
      </label>

      <label>
        End Date
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => updateField("endDate", e.target.value)}
        />
      </label>

      <label>
        Age Group
        <select
          value={filters.ageGroup}
          onChange={(e) => updateField("ageGroup", e.target.value)}
        >
          <option value="<18">&lt;18</option>
          <option value="18-40">18-40</option>
          <option value=">40">&gt;40</option>
        </select>
      </label>

      <label>
        Gender
        <select
          value={filters.gender}
          onChange={(e) => updateField("gender", e.target.value)}
        >
          <option value="All">All</option>
          <option value="Male">Male</option>
          <option value="Female">Female</option>
          <option value="Other">Other</option>
        </select>
      </label>
    </section>
  );
}

export default FilterPanel;
