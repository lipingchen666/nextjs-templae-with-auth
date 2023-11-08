'use client'
import { supabaseClient } from '@/lib/supabase';
import React from 'react'

export type Country = {
    id: number
    name: string
}

const page = () => {
    const [countries, setCountries] = React.useState<Country[]>([]);

    React.useEffect(() => {
        getCountries();
    }, []);

    async function getCountries() {
        const { data } = await supabaseClient.from("countries").select();
        setCountries(data ?? []);
    }

    return (
        <ul>
            {countries.map((country) => (
                <li key={country.name}>{country.name}</li>
            ))}
        </ul>
    )
}

export default page