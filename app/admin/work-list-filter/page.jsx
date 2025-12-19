"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

export default function WorksPage() {
    const [works, setWorks] = useState([]);
    const [cities, setCities] = useState([]);
    const [locals, setLocals] = useState([]);
    const [services, setServices] = useState([]);
    const [filteredLocals, setFilteredLocals] = useState([]);

    const [filters, setFilters] = useState({
        title: "",
        status: "",
        service: "",
        city: "",
        local: "",
    });

    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const limit = 6;

    // FETCH FILTER DATA
    useEffect(() => {
        fetch("http://localhost:8000/api/city")
            .then(res => res.json())
            .then(d => setCities(d.citys || []));

        fetch("http://localhost:8000/api/local-aria")
            .then(res => res.json())
            .then(d => setLocals(d.loaclArias || []));

        fetch("http://localhost:8000/api/services")
            .then(res => res.json())
            .then(d => setServices(d.services || []));
    }, []);

    // FETCH WORKS
    useEffect(() => {
        fetchWorks();
    }, [filters, page]);

    async function fetchWorks() {
        const params = new URLSearchParams({
            ...filters,
            page,
            limit,
        });

        const res = await fetch(`http://localhost:8000/api/works?${params}`);
        const data = await res.json();

        if (data.success) {
            setWorks(data.works);
            setPages(data.pagination.pages);
        }
    }

    function handleFilterChange(e) {
        const { name, value } = e.target;

        if (name === "city") {
            setFilters(p => ({ ...p, city: value, local: "" }));
            setFilteredLocals(locals.filter(l => l.sctyid === value));
            return;
        }

        setFilters(p => ({ ...p, [name]: value }));
        setPage(1);
    }

    return (
        <div className="min-h-screen bg-gray-100 p-6">
            <h1 className="text-2xl font-bold mb-4">All Works</h1>

            {/* FILTERS */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-6">
                <input
                    name="title"
                    placeholder="Search title"
                    className="border p-2 rounded"
                    onChange={handleFilterChange}
                />

                <select name="status" className="border p-2" onChange={handleFilterChange}>
                    <option value="">All Status</option>
                    <option value="OPEN">OPEN</option>
                    <option value="ACCEPTED">ACCEPTED</option>
                    <option value="STARTED">STARTED</option>
                    <option value="COMPLETED">COMPLETED</option>
                </select>

                <select name="service" className="border p-2" onChange={handleFilterChange}>
                    <option value="">All Services</option>
                    {services.map(s => (
                        <option key={s._id} value={s.ssrvcid}>{s.name}</option>
                    ))}
                </select>

                <select name="city" className="border p-2" onChange={handleFilterChange}>
                    <option value="">All Cities</option>
                    {cities.map(c => (
                        <option key={c._id} value={c.sctyid}>{c.name}</option>
                    ))}
                </select>

                <select
                    name="local"
                    className="border p-2"
                    disabled={!filters.city}
                    onChange={handleFilterChange}
                >
                    <option value="">All Local Areas</option>
                    {filteredLocals.map(l => (
                        <option key={l._id} value={l.sloctyid}>{l.name}</option>
                    ))}
                </select>
            </div>

            {/* WORK LIST */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {works.map(w => (
                    <div key={w._id} className="bg-white p-4 rounded shadow">
                        <h3 className="font-bold">{w.title}</h3>
                        <p className="text-sm text-gray-600">{w.description}</p>
                        <p className="text-sm mt-2">Price: ₹{w.price}</p>
                        <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                            {w.status || "pending"}
                        </span>
                        {w.status ==="OPEN"? 
                        <p>
                            <span className="text-xs bg-blue-100 px-2 py-1 rounded">
                                {/* {w.swrid || "pending"} */}
                                <Link href={`/admin/work-full-detils/${w.swrid}`} >Full Details </Link>
                                
                            </span>
                        </p>:null}



                       
                    </div>
                ))}
            </div>

            {/* PAGINATION */}
            <div className="flex justify-center mt-6 gap-2">
                <button
                    disabled={page === 1}
                    onClick={() => setPage(p => p - 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                >
                    Prev
                </button>

                <span>{page} / {pages}</span>

                <button
                    disabled={page === pages}
                    onClick={() => setPage(p => p + 1)}
                    className="px-3 py-1 bg-gray-300 rounded"
                >
                    Next
                </button>
            </div>
        </div>
    );
}
