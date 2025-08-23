import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

export default async function handler(req, res) {
  if (req.method === 'POST') {
    const { userID, toolID } = req.body;

    // Update tool checkout
    const { error } = await supabase
      .from('tools')
      .update({ checkedOutBy: userID })
      .eq('toolID', toolID);

    if (error) return res.status(500).json({ error: error.message });

    // Log transaction
    await supabase.from('transactions').insert([{ userID, toolID, action: 'checkout' }]);

    res.status(200).json({ success: true, message: `Tool ${toolID} checked out by ${userID}` });
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}
