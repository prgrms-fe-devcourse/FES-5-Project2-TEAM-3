import { createClient } from "@supabase/supabase-js"

export async function getData(table : string){
	const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);
	const {data, error} = await supabase
		.from(table)
		.select('*');

	if (error)
		console.error('error occured');
	else
		return data;
}
