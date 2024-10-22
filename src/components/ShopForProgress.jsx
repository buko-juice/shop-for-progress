import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Alert, AlertDescription } from './ui/alert';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ScrollArea } from './ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import { Calendar, DollarSign, History, PlusCircle } from 'lucide-react';

const STEPS = {
  ASK_PURCHASE: 'ASK_PURCHASE',
  ENTER_AMOUNT: 'ENTER_AMOUNT',
  SHOW_DONATION: 'SHOW_DONATION',
  CONFIRM_DONATION: 'CONFIRM_DONATION',
  COMPLETE: 'COMPLETE'
};

const CAMPAIGNS = [
  {
    name: 'Harris-Walz 2024',
    description: 'Support the presidential campaign',
    website: 'https://example.com/harris-walz'
  },
  {
    name: 'Fair Fight',
    description: 'Fighting for free and fair elections',
    website: 'https://example.com/fair-fight'
  },
  {
    name: 'Working Families Party',
    description: 'Building progressive political power',
    website: 'https://example.com/wfp'
  },
  {
    name: 'Common Defense',
    description: 'Progressive veterans advocating for democracy',
    website: 'https://example.com/common-defense'
  }
];

function ShopForProgress() {
  // Core state
  const [step, setStep] = useState(STEPS.ASK_PURCHASE);
  const [purchaseAmount, setPurchaseAmount] = useState('');
  const [donationAmount, setDonationAmount] = useState(0);
  const [selectedCampaign, setSelectedCampaign] = useState('');
  const [showEncouragement, setShowEncouragement] = useState(false);
  
  // Totals and history
  const [totalPurchases, setTotalPurchases] = useState(() => {
    const saved = localStorage.getItem('totalPurchases');
    return saved ? parseFloat(saved) : 0;
  });
  const [totalDonations, setTotalDonations] = useState(() => {
    const saved = localStorage.getItem('totalDonations');
    return saved ? parseFloat(saved) : 0;
  });
  const [donationHistory, setDonationHistory] = useState(() => {
    const saved = localStorage.getItem('donationHistory');
    return saved ? JSON.parse(saved) : [];
  });
  const [purchaseHistory, setPurchaseHistory] = useState(() => {
    const saved = localStorage.getItem('purchaseHistory');
    return saved ? JSON.parse(saved) : [];
  });

  // Manual entry state
  const [manualDonationAmount, setManualDonationAmount] = useState('');
  const [manualPurchaseAmount, setManualPurchaseAmount] = useState('');
  const [manualDonationCampaign, setManualDonationCampaign] = useState('');
  const [manualPurchaseNote, setManualPurchaseNote] = useState('');

  // Local storage effects
  useEffect(() => {
    localStorage.setItem('totalPurchases', totalPurchases);
    localStorage.setItem('totalDonations', totalDonations);
    localStorage.setItem('donationHistory', JSON.stringify(donationHistory));
    localStorage.setItem('purchaseHistory', JSON.stringify(purchaseHistory));
  }, [totalPurchases, totalDonations, donationHistory, purchaseHistory]);

  // Core flow handlers
  const handleYesPurchase = () => setStep(STEPS.ENTER_AMOUNT);
  
  const handleNoPurchase = () => {
    setShowEncouragement(true);
    setTimeout(() => setShowEncouragement(false), 3000);
  };

  const handleAmountSubmit = () => {
    const amount = parseFloat(purchaseAmount);
    if (!isNaN(amount) && amount > 0) {
      setTotalPurchases(prev => prev + amount);
      setPurchaseHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount,
        note: 'Regular purchase flow'
      }]);
      setDonationAmount(amount * 0.5);
      setStep(STEPS.SHOW_DONATION);
    }
  };

  const handleDonationConfirm = () => {
    if (selectedCampaign) {
      setTotalDonations(prev => prev + donationAmount);
      setDonationHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount: donationAmount,
        campaign: selectedCampaign,
        source: 'Regular flow'
      }]);
      setStep(STEPS.COMPLETE);
    }
  };

  // Manual entry handlers
  const handleManualDonation = () => {
    const amount = parseFloat(manualDonationAmount);
    if (!isNaN(amount) && amount > 0 && manualDonationCampaign) {
      setTotalDonations(prev => prev + amount);
      setDonationHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount,
        campaign: manualDonationCampaign,
        source: 'Manual entry'
      }]);
      setManualDonationAmount('');
      setManualDonationCampaign('');
    }
  };

  const handleManualPurchase = () => {
    const amount = parseFloat(manualPurchaseAmount);
    if (!isNaN(amount) && amount > 0) {
      setTotalPurchases(prev => prev + amount);
      setPurchaseHistory(prev => [...prev, {
        date: new Date().toISOString(),
        amount,
        note: manualPurchaseNote || 'Manual entry'
      }]);
      setManualPurchaseAmount('');
      setManualPurchaseNote('');
    }
  };

  const clearAllData = () => {
    localStorage.clear();
    setTotalPurchases(0);
    setTotalDonations(0);
    setDonationHistory([]);
    setPurchaseHistory([]);
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
    setDonationAmount(0);
    setSelectedCampaign('');
  };

  const resetFlow = () => {
    setStep(STEPS.ASK_PURCHASE);
    setPurchaseAmount('');
    setDonationAmount(0);
    setSelectedCampaign('');
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

return (
    <Card className="w-full max-w-3xl mx-auto">
      <CardHeader>
        <CardTitle className="text-2xl font-bold text-blue-900">
          Shop for Progress
        </CardTitle>
        <CardDescription>
          Track purchases and support progressive campaigns
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="main" className="space-y-4">
          <TabsList className="grid grid-cols-4 gap-4">
            <TabsTrigger value="main">Main</TabsTrigger>
            <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
            <TabsTrigger value="manual">Add Manual</TabsTrigger>
            <TabsTrigger value="history">History</TabsTrigger>
          </TabsList>

          {/* Main Tab */}
          <TabsContent value="main" className="space-y-4">
            {/* Totals Display */}
            <div className="grid grid-cols-2 gap-4 p-4 bg-blue-50 rounded-lg">
              <div>
                <div className="text-sm text-blue-600">Total Purchases</div>
                <div className="text-lg font-bold">${totalPurchases.toFixed(2)}</div>
              </div>
              <div>
                <div className="text-sm text-blue-600">Total Donations</div>
                <div className="text-lg font-bold">${totalDonations.toFixed(2)}</div>
              </div>
            </div>

            {/* Main Flow */}
            {step === STEPS.ASK_PURCHASE && (
              <div className="space-y-4">
                <p className="text-center">Did you make a non-essential purchase today?</p>
                <div className="flex justify-center gap-4">
                  <Button onClick={handleYesPurchase} className="bg-blue-600 hover:bg-blue-700">
                    Yes
                  </Button>
                  <Button onClick={handleNoPurchase} variant="outline">
                    No
                  </Button>
                </div>
              </div>
            )}

            {step === STEPS.ENTER_AMOUNT && (
              <div className="space-y-4">
                <p>Enter your purchase amount:</p>
                <Input
                  type="number"
                  value={purchaseAmount}
                  onChange={(e) => setPurchaseAmount(e.target.value)}
                  placeholder="0.00"
                  className="text-right"
                />
                <Button 
                  onClick={handleAmountSubmit}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!purchaseAmount || parseFloat(purchaseAmount) <= 0}
                >
                  Continue
                </Button>
              </div>
            )}

            {step === STEPS.SHOW_DONATION && (
              <div className="space-y-4">
                <p>Suggested donation: ${donationAmount.toFixed(2)}</p>
                <p>Select a campaign to support:</p>
                <div className="space-y-2">
                  {CAMPAIGNS.map(campaign => (
                    <Button
                      key={campaign.name}
                      onClick={() => setSelectedCampaign(campaign.name)}
                      variant={selectedCampaign === campaign.name ? "default" : "outline"}
                      className="w-full text-left justify-start"
                    >
                      {campaign.name}
                    </Button>
                  ))}
                </div>
                <Button
                  onClick={handleDonationConfirm}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                  disabled={!selectedCampaign}
                >
                  Confirm Donation
                </Button>
              </div>
            )}

            {step === STEPS.COMPLETE && (
              <div className="space-y-4">
                <Alert className="bg-green-50 border-green-200">
                  <AlertDescription>
                    Thank you for your donation of ${donationAmount.toFixed(2)} to {selectedCampaign}!
                  </AlertDescription>
                </Alert>
                <Button onClick={resetFlow} className="w-full">
                  Start New Purchase
                </Button>
              </div>
            )}

            {showEncouragement && (
              <Alert className="bg-yellow-50 border-yellow-200">
                <AlertDescription>
                  Great job avoiding unnecessary purchases! Consider making a donation anyway?
                </AlertDescription>
              </Alert>
            )}
          </TabsContent>

{/* Campaigns Tab */}
          <TabsContent value="campaigns" className="space-y-4">
            <div className="grid gap-4">
              {CAMPAIGNS.map(campaign => (
                <Card key={campaign.name}>
                  <CardHeader>
                    <CardTitle>{campaign.name}</CardTitle>
                    <CardDescription>{campaign.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button
                      variant="outline"
                      className="w-full"
                      onClick={() => window.open(campaign.website, '_blank')}
                    >
                      Learn More
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Manual Entry Tab */}
          <TabsContent value="manual" className="space-y-4">
            <div className="grid gap-6">
              {/* Manual Purchase Entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Purchase</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="number"
                    value={manualPurchaseAmount}
                    onChange={(e) => setManualPurchaseAmount(e.target.value)}
                    placeholder="Purchase amount"
                    className="text-right"
                  />
                  <Input
                    type="text"
                    value={manualPurchaseNote}
                    onChange={(e) => setManualPurchaseNote(e.target.value)}
                    placeholder="Note (optional)"
                  />
                  <Button 
                    onClick={handleManualPurchase}
                    className="w-full"
                    disabled={!manualPurchaseAmount || parseFloat(manualPurchaseAmount) <= 0}
                  >
                    Add Purchase
                  </Button>
                </CardContent>
              </Card>

              {/* Manual Donation Entry */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Add Donation</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Input
                    type="number"
                    value={manualDonationAmount}
                    onChange={(e) => setManualDonationAmount(e.target.value)}
                    placeholder="Donation amount"
                    className="text-right"
                  />
                  <div className="space-y-2">
                    {CAMPAIGNS.map(campaign => (
                      <Button
                        key={campaign.name}
                        onClick={() => setManualDonationCampaign(campaign.name)}
                        variant={manualDonationCampaign === campaign.name ? "default" : "outline"}
                        className="w-full text-left justify-start"
                      >
                        {campaign.name}
                      </Button>
                    ))}
                  </div>
                  <Button 
                    onClick={handleManualDonation}
                    className="w-full"
                    disabled={!manualDonationAmount || !manualDonationCampaign || parseFloat(manualDonationAmount) <= 0}
                  >
                    Add Donation
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

{/* History Tab */}
          <TabsContent value="history" className="space-y-4">
            <Tabs defaultValue="donations" className="space-y-4">
              <TabsList>
                <TabsTrigger value="donations">Donations</TabsTrigger>
                <TabsTrigger value="purchases">Purchases</TabsTrigger>
              </TabsList>

              <TabsContent value="donations">
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-2">
                    {donationHistory.map((donation, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">${donation.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{donation.campaign}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(donation.date)}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                    {donationHistory.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No donations recorded yet</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              <TabsContent value="purchases">
                <ScrollArea className="h-[400px] rounded-md border p-4">
                  <div className="space-y-2">
                    {purchaseHistory.map((purchase, index) => (
                      <Card key={index}>
                        <CardHeader className="py-3">
                          <div className="flex justify-between items-center">
                            <div>
                              <p className="font-medium">${purchase.amount.toFixed(2)}</p>
                              <p className="text-sm text-gray-500">{purchase.note}</p>
                            </div>
                            <div className="text-sm text-gray-500">
                              {formatDate(purchase.date)}
                            </div>
                          </div>
                        </CardHeader>
                      </Card>
                    ))}
                    {purchaseHistory.length === 0 && (
                      <p className="text-center text-gray-500 py-4">No purchases recorded yet</p>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>

        {/* Clear Data Button */}
        <Button
          onClick={clearAllData}
          variant="outline"
          className="w-full mt-8 text-red-600 border-red-200 hover:bg-red-50"
        >
          Clear All Data
        </Button>
      </CardContent>
    </Card>
  );
}

export default ShopForProgress;