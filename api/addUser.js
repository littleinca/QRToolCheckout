import { createClient } from '@supabase/supabase-js';
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_ANON_KEY);

export default async function handler(req,res){
  if(req.method==='POST'){
    const {userID,name}=req.body;
    await supabase.from('users').insert([{userID,name}]);
    res.status(200).json({success:true,message:`User ${name} added.`});
  } else res.status(405).json({error:'Method not allowed'});
}