import { useState, useEffect } from 'react';
import { processPostback, PostbackData, getPostbackUrl } from '../services/postbackService';
import { supabase } from '../lib/supabase';

interface DbData {
  offerClicks: any[];
  completedOffers: any[];
  userMetadata: any;
}

interface ManualTestData {
  click_id: string;
  payout: string;
  offer_id: string;
  tracking_id: string;
}

export default function TestPostback() {
  const [testData, setTestData] = useState<PostbackData | null>(null);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState<string>('');
  const [dbData, setDbData] = useState<DbData | null>(null);
  const [manualData, setManualData] = useState<ManualTestData>({
    click_id: '',
    payout: '10.00',
    offer_id: '',
    tracking_id: ''
  });
  const [postbackUrl, setPostbackUrl] = useState<string>('');

  const fetchDatabaseData = async () => {
    try {
      // Get offer clicks
      const { data: offerClicks, error: clicksError } = await supabase
        .from('offer_clicks')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (clicksError) throw clicksError;

      // Get completed offers
      const { data: completedOffers, error: offersError } = await supabase
        .from('completed_offers')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      if (offersError) throw offersError;

      // Get user metadata
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      setDbData({
        offerClicks: offerClicks || [],
        completedOffers: completedOffers || [],
        userMetadata: user?.user_metadata || {}
      });
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to fetch database data');
    }
  };

  const generateTestData = async () => {
    try {
      // First, create a real offer click
      const { data: { user }, error: userError } = await supabase.auth.getUser();
      if (userError) throw userError;

      if (!user) {
        throw new Error('Please login first');
      }

      // Create an offer click record
      const { data: offerClick, error: clickError } = await supabase
        .from('offer_clicks')
        .insert([
          {
            user_id: user.id,
            offer_title: `Test Offer ${Math.random().toString(36).substring(7)}`,
            offer_type: 'test',
            reward: 10.00,
            original_link: 'https://test.com/offer',
            status: 'pending'
          }
        ])
        .select()
        .single();

      if (clickError) throw clickError;

      if (!offerClick) {
        throw new Error('Failed to create offer click');
      }

      // Now create the postback data using the real click ID
      const testPostbackData: PostbackData = {
        click_id: offerClick.id,
        status: 'completed',
        payout: 10.00,
        offer_id: `offer_${Math.random().toString(36).substring(7)}`,
        tracking_id: `track_${Math.random().toString(36).substring(7)}`,
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
      };

      setTestData(testPostbackData);
      setPostbackUrl(getPostbackUrl(offerClick.id));
      await fetchDatabaseData(); // Refresh to show the new offer click
      setError('');
    } catch (err: any) {
      setError(err.message || 'Failed to generate test data');
      setTestData(null);
    }
  };

  const handleManualTest = async () => {
    try {
      const testPostbackData: PostbackData = {
        click_id: manualData.click_id,
        status: 'completed',
        payout: parseFloat(manualData.payout),
        offer_id: manualData.offer_id,
        tracking_id: manualData.tracking_id,
        ip_address: '127.0.0.1',
        user_agent: navigator.userAgent,
      };

      const response = await processPostback(testPostbackData);
      setResult(response);
      setError('');
      await fetchDatabaseData();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResult(null);
    }
  };

  const handleTestPostback = async () => {
    if (!testData) return;
    
    try {
      const response = await processPostback(testData);
      setResult(response);
      setError('');
      await fetchDatabaseData();
    } catch (err: any) {
      setError(err.message || 'An error occurred');
      setResult(null);
    }
  };

  // Fetch initial data
  useEffect(() => {
    fetchDatabaseData();
  }, []);

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-6">Postback Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Test Postback</h2>
          
          {/* Automatic Test Section */}
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold mb-4">Automatic Test</h3>
            <div className="mb-4">
              <button
                onClick={generateTestData}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Generate Test Data
              </button>
              <p className="text-sm text-gray-400 mt-2">
                This will create a real offer click record before generating test data
              </p>
            </div>

            {testData && (
              <div className="mb-6">
                <h4 className="text-md font-semibold mb-3">Test Data:</h4>
                <pre className="bg-gray-100 p-4 rounded text-sm">
                  {JSON.stringify(testData, null, 2)}
                </pre>
                
                {postbackUrl && (
                  <div className="mt-4 mb-4">
                    <h4 className="text-md font-semibold mb-2">Postback URL:</h4>
                    <div className="bg-gray-100 p-4 rounded">
                      <code className="text-sm break-all">{postbackUrl}</code>
                    </div>
                  </div>
                )}
                
                <button
                  onClick={handleTestPostback}
                  className="bg-green-500 text-white px-4 py-2 rounded mt-4 hover:bg-green-600"
                >
                  Test Postback
                </button>
              </div>
            )}
          </div>

          {/* Manual Test Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-semibold mb-4">Manual Test</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Click ID
                </label>
                <input
                  type="text"
                  value={manualData.click_id}
                  onChange={(e) => setManualData(prev => ({ ...prev, click_id: e.target.value }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter click ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Payout
                </label>
                <input
                  type="number"
                  value={manualData.payout}
                  onChange={(e) => setManualData(prev => ({ ...prev, payout: e.target.value }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter payout amount"
                  step="0.01"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Offer ID
                </label>
                <input
                  type="text"
                  value={manualData.offer_id}
                  onChange={(e) => setManualData(prev => ({ ...prev, offer_id: e.target.value }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter offer ID"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tracking ID
                </label>
                <input
                  type="text"
                  value={manualData.tracking_id}
                  onChange={(e) => setManualData(prev => ({ ...prev, tracking_id: e.target.value }))}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter tracking ID"
                />
              </div>
              <button
                onClick={handleManualTest}
                className="w-full bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600"
              >
                Test Manual Postback
              </button>
            </div>
          </div>

          {error && (
            <div className="text-red-500 mt-4 p-4 bg-red-50 rounded">
              Error: {error}
            </div>
          )}

          {result && (
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-3">Result:</h3>
              <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded mb-4">
                <p className="text-green-700 font-medium">Postback Successfully Processed!</p>
                <p className="text-sm text-green-600 mt-1">
                  Completed Offer ID: {result}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  Check the Database Records section to see the updated data
                </p>
              </div>
              <div className="bg-gray-100 p-4 rounded">
                <h4 className="text-sm font-semibold mb-2">Full Response:</h4>
                <pre className="text-sm">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Database Records</h2>
          <button
            onClick={fetchDatabaseData}
            className="bg-purple-500 text-white px-4 py-2 rounded mb-4 hover:bg-purple-600"
          >
            Refresh Data
          </button>

          {dbData && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold mb-2">User Metadata</h3>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(dbData.userMetadata, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Offer Clicks (Last 5)</h3>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(dbData.offerClicks, null, 2)}
                </pre>
              </div>

              <div>
                <h3 className="text-lg font-semibold mb-2">Recent Completed Offers (Last 5)</h3>
                <pre className="bg-gray-100 p-4 rounded">
                  {JSON.stringify(dbData.completedOffers, null, 2)}
                </pre>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}