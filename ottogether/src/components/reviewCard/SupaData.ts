import { supabase } from "../../supabase/supabase";
import type { Database } from "../../supabase/supabase.type";

type Tables = keyof Database['public']['Tables'];

export async function getData(table : Tables, orderOption : string = 'created_at'){
	const {data, error} = await supabase
		.from(table)
		.select('*')
		.order(orderOption, {ascending: false});

	if (error) {
		console.error('error occured');
		return null;
	}
	else
		return data;
}
