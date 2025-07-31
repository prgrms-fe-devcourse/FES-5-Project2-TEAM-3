import { createClient } from "@supabase/supabase-js"

const supabase = createClient(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY);

export async function getData(table : string, orderOption : string = 'created_at'){
	const {data, error} = await supabase
		.from(table)
		.select('*')
		.order(orderOption, {ascending: false});

	if (error)
		console.error('error occured');
	else
		return data;
}
