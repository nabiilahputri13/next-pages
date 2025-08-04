import { useState } from "react";
import Workshops from "@/components/workshops";

export default function SearchWorkshop() {
    const [search, setSearch] = useState("");
    return (
        <div>
            <div className="container mx-auto p-4">
                <div className="mt-6 flex justify-center">
                    {/* <label htmlFor="search" className="block text-sm font-medium mb-1"></label> */}
                    <input
                        id="search"
                        type="text"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        placeholder="Search workshop..."
                        className="border rounded-lg px-3 py-2 w-full max-w-xl"
                    />
                </div>
                <Workshops search={search} />
            </div>
        </div>
    )
}