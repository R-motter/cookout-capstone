export default function SearchBox({ onChange }) {
    function handleChange(event) {
      onChange(event.target.value);
    }
    return (
      <section className="box is-flex">
        <label>Search Users</label>
        <input className="input is-rounded" onChange={handleChange} />
      </section>
    );
  }