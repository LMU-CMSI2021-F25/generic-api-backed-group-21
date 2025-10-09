import { useState } from 'react';
import './App.css';

export default function App() {
    const [query, setQuery] = useState('');
    const [country, setCountry] = useState(null);
    const [loading, setLoading] = useState(false);
    const [err, setErr] = useState('');

    async function handleSearch(e) {
        e.preventDefault();
        if (!query.trim()) return;

        setLoading(true);
        setErr('');
        setCountry(null);

        try {
            // REST Countries v3.1
            const url = `https://restcountries.com/v3.1/name/${encodeURIComponent(
                query.trim()
            )}?fields=name,flags,capital,region,subregion,population,currencies,languages,cca2,cca3`;
            const res = await fetch(url);
            if (!res.ok) {
                throw new Error('Country not found');
            }
            const data = await res.json();
            // They can return multiple matches; take the first for simplicity
            setCountry(data[0]);
        } catch (e) {
            setErr(e.message || 'Something went wrong');
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="App">
            <h1>Country Finder</h1>

            {/* Search bar */}
            <form className="search" onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="Type a country (e.g., Japan)..."
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    aria-label="Country name"
                />
                <button type="submit" disabled={loading}>
                    {loading ? 'Searching…' : 'Search'}
                </button>
            </form>

            {/* Error */}
            {err && <p className="error">{err}</p>}

            {/* Result */}
            {country && (
                <div className="card">
                    <div className="flag-wrap">
                        <img src={country.flags?.svg || country.flags?.png} alt={country.flags?.alt || `${country.name?.common} flag`} />
                    </div>

                    <div className="details">
                        <h2>{country.name?.common}</h2>
                        <p><strong>Official:</strong> {country.name?.official}</p>
                        <p><strong>Region:</strong> {country.region}{country.subregion ? ` • ${country.subregion}` : ''}</p>
                        <p><strong>Capital:</strong> {country.capital?.join(', ') || '—'}</p>
                        <p><strong>Population:</strong> {country.population?.toLocaleString() || '—'}</p>
                        <p><strong>Languages:</strong> {country.languages ? Object.values(country.languages).join(', ') : '—'}</p>
                        <p>
                            <strong>Currencies:</strong>{' '}
                            {country.currencies
                                ? Object.values(country.currencies)
                                    .map((c) => `${c.name} (${c.symbol || ''})`.trim())
                                    .join(', ')
                                : '—'}
                        </p>
                        <p><strong>Codes:</strong> {country.cca2} / {country.cca3}</p>
                    </div>
                </div>
            )}
        </div>
    );
}
