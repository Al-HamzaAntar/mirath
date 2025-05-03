
import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EstateForm from '@/components/EstateForm';
import HeirsForm from '@/components/HeirsForm';
import InheritanceResults from '@/components/InheritanceResults';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Heir, 
  Estate, 
  calculateNetEstate, 
  calculateInheritance 
} from '@/utils/inheritanceCalculator';

const Index = () => {
  const { toast } = useToast();
  const { t } = useLanguage();

  // Estate state
  const [totalAssets, setTotalAssets] = useState(1000000);
  const [totalDebts, setTotalDebts] = useState(0);
  const [funeralExpenses, setFuneralExpenses] = useState(0);
  const [bequests, setBequests] = useState(0);
  const [currency, setCurrency] = useState('SAR');

  // Heirs state
  const [selectedHeirs, setSelectedHeirs] = useState<Heir[]>([]);
  
  // Results state
  const [calculatedHeirs, setCalculatedHeirs] = useState<Heir[]>([]);
  const [calculatedEstate, setCalculatedEstate] = useState<Estate | null>(null);
  const [aul, setAul] = useState(false);
  const [radd, setRadd] = useState(false);
  const [showResults, setShowResults] = useState(false);

  const handleCalculateNetEstate = () => {
    if (totalAssets <= 0) {
      toast({
        title: t('toast.invalidAssets'),
        description: t('toast.assetsError'),
        variant: "destructive",
      });
      return;
    }

    if (bequests > totalAssets * (1/3)) {
      toast({
        title: t('toast.bequestWarning'),
        description: t('toast.bequestError'),
        variant: "default",
      });
    }

    const netEstate = calculateNetEstate({
      totalAssets,
      totalDebts,
      funeralExpenses,
      bequests,
      currency
    });

    toast({
      title: t('toast.estateCalculated'),
      description: `${t('toast.netEstateAmount')} ${netEstate.toLocaleString()} ${currency}`,
    });
  };

  const handleCalculateInheritance = () => {
    if (selectedHeirs.length === 0) {
      toast({
        title: t('toast.noHeirs'),
        description: t('toast.noHeirsError'),
        variant: "destructive",
      });
      return;
    }

    const estateData = {
      totalAssets,
      totalDebts,
      funeralExpenses,
      bequests,
      currency
    };

    const result = calculateInheritance(selectedHeirs, estateData);
    
    setCalculatedHeirs(result.heirs);
    setCalculatedEstate(result.estate);
    setAul(result.aul);
    setRadd(result.radd);
    setShowResults(true);

    toast({
      title: t('toast.inheritanceCalculated'),
      description: t('toast.inheritanceDescription'),
    });
    
    // Scroll to results
    setTimeout(() => {
      document.getElementById('inheritance-results')?.scrollIntoView({ behavior: 'smooth' });
    }, 100);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleReset = () => {
    setShowResults(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen">
      <div className="container mx-auto px-4 py-6">
        <Header />
        
        <main className="max-w-4xl mx-auto">
          {!showResults ? (
            <>
              <EstateForm
                totalAssets={totalAssets}
                setTotalAssets={setTotalAssets}
                totalDebts={totalDebts}
                setTotalDebts={setTotalDebts}
                funeralExpenses={funeralExpenses}
                setFuneralExpenses={setFuneralExpenses}
                bequests={bequests}
                setBequests={setBequests}
                currency={currency}
                setCurrency={setCurrency}
                onCalculateNetEstate={handleCalculateNetEstate}
              />
              
              <HeirsForm 
                selectedHeirs={selectedHeirs}
                setSelectedHeirs={setSelectedHeirs}
                onCalculateInheritance={handleCalculateInheritance}
              />
            </>
          ) : calculatedEstate && (
            <InheritanceResults
              heirs={calculatedHeirs}
              estate={calculatedEstate}
              aul={aul}
              radd={radd}
              onPrint={handlePrint}
              onReset={handleReset}
            />
          )}
        </main>
        
        <Footer />
      </div>
    </div>
  );
};

export default Index;
