import React, { useState } from 'react';
import { useToast } from '@/components/ui/use-toast';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import EstateForm from '@/components/EstateForm';
import HeirsForm from '@/components/HeirsForm';
import InheritanceResults from '@/components/InheritanceResults';
import { 
  Heir, 
  Estate, 
  calculateNetEstate, 
  calculateInheritance 
} from '@/utils/inheritanceCalculator';

const Index = () => {
  const { toast } = useToast();

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
        title: "خطأ في البيانات",
        description: "يجب أن تكون قيمة الأصول أكبر من صفر",
        variant: "destructive",
      });
      return;
    }

    if (bequests > totalAssets * (1/3)) {
      toast({
        title: "تنبيه بخصوص الوصية",
        description: "الوصية تتجاوز ثلث التركة، وهذا قد لا يكون مقبولاً شرعاً",
        // Fixed warning variant to match allowed types
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
      title: "تم حساب صافي التركة",
      description: `صافي التركة: ${netEstate.toLocaleString()} ${currency}`,
    });
  };

  const handleCalculateInheritance = () => {
    if (selectedHeirs.length === 0) {
      toast({
        title: "لا يوجد ورثة",
        description: "يرجى تحديد الورثة أولاً",
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
      title: "تم حساب الميراث",
      description: "تم توزيع التركة وفق أحكام الشريعة الإسلامية",
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
    <div className="min-h-screen" dir="rtl">
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
