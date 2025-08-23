import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req,res){
  if(req.method==='POST'){
    const {toolID,name}=req.body;
    await supabase.from('tools').insert([{toolID,name}]);
    res.status(200).json({success:true,message:`Tool ${name} added.`});
  } else res.status(405).json({error:'Method not allowed'});
}