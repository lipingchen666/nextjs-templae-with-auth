'use client';
import useSupabaseRealTime from '@/lib/react-hooks/useSupabaseRealTime';
import React from 'react'
import { Country } from '../countries/page';
import { supabaseClient } from '@/lib/supabase';

const page = () => {
    const [data, error] = useSupabaseRealTime('countries');
    const [countries, setCountries] = React.useState<Country[]>([]);

    const fetchCountries = async () => {
        const { data } = await supabaseClient.from("countries").select();
        setCountries(data ?? []);
    }

    React.useEffect(() => {
        if (!!data && Object.keys(data).length > 0) {
            fetchCountries();
        }
    }, [data, setCountries])

    React.useEffect(() => {
        fetchCountries();
    }, [])

    return !!countries && (
        <ul>
            {countries.map((country) => (
                <li key={country.name}>{country.name}</li>
            ))}
        </ul>
    )
}

export default page