import { supabase } from "@/integrations/supabase/client";

type LogLevel = 'info' | 'warn' | 'error' | 'debug';

interface LogData {
  [key: string]: any;
}

export function useLogger() {
  const log = async (event: string, data?: LogData, level: LogLevel = 'info') => {
    try {
      console.log(`[${level.toUpperCase()}] ${event}:`, data);

      const { error } = await supabase.functions.invoke('logger', {
        body: { event, data, level }
      });

      if (error) {
        console.error('Error logging event:', error);
      }
    } catch (error) {
      console.error('Error in useLogger:', error);
    }
  };

  return {
    log,
    info: (event: string, data?: LogData) => log(event, data, 'info'),
    warn: (event: string, data?: LogData) => log(event, data, 'warn'),
    error: (event: string, data?: LogData) => log(event, data, 'error'),
    debug: (event: string, data?: LogData) => log(event, data, 'debug')
  };
}