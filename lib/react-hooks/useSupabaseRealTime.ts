import React from 'react';
import { supabaseClient } from '../supabase';
import { REALTIME_POSTGRES_CHANGES_LISTEN_EVENT, RealtimePostgresChangesPayload } from '@supabase/supabase-js';
import { Country } from '@/app/(publicRoutes)/countries/page';

function useOnlineStatus() {
    const [isOnline, setIsOnline] = useState(true);
    useEffect(() => {
      function handleOnline() {
        setIsOnline(true);
      }
      function handleOffline() {
        setIsOnline(false);
      }
      window.addEventListener('online', handleOnline);
      window.addEventListener('offline', handleOffline);
      return () => {
        window.removeEventListener('online', handleOnline);
        window.removeEventListener('offline', handleOffline);
      };
    }, []);
    return isOnline;
  }

const useSupabaseRealTime = (postgresTb: string) => {
    const [data, setData] = React.useState<Country | {}>();
    const [error, setError] = React.useState<string[] | null>(null);
    React.useEffect(() => {
        const callback = (payload:  RealtimePostgresChangesPayload<Country>) => {
            setData(payload.new);
            setError(payload.errors);
        }
        const subscribeToSupabase = () => {
            const channel = supabaseClient.channel('schema-db-changes')
            .on(
              'postgres_changes',
              {
                event: '*',
                schema: 'public',
                table: postgresTb
              },
              callback
            )
            .subscribe()

            return channel;
        }
        const channel = subscribeToSupabase();

        return () => {
            channel.unsubscribe();
        }
    }, [])
    
    return [data, error];
}

export default useSupabaseRealTime;