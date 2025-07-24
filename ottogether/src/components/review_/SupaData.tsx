import { createClient } from "@supabase/supabase-js"

async function getData(){
	const supabase = createClient(import.meta.env.VITE_PROJECT_URL, import.meta.env.VITE_API_KEY);
	const {data, error} = await supabase
		.from('review')
		.select('*');
	
	console.log('data : ', data, 'error : ', error);
	return data;
}

function SupaData() {
	getData();
	return (
		<div>hi</div>
	)
}
export default SupaData