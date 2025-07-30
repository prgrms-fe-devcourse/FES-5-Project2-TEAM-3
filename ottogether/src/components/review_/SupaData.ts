import { createClient } from "@supabase/supabase-js"

const supabase = createClient(import.meta.env.VITE_PROJECT_URL, import.meta.env.VITE_API_KEY);

export async function getData(table : string){
	const {data, error} = await supabase
		.from(table)
		.select('*');

	if (error)
		console.error('error occured');
	else
		return data;
}
