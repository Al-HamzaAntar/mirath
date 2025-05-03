
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useLanguage } from '@/contexts/LanguageContext';

interface EstateFormProps {
  totalAssets: number;
  setTotalAssets: React.Dispatch<React.SetStateAction<number>>;
  totalDebts: number;
  setTotalDebts: React.Dispatch<React.SetStateAction<number>>;
  funeralExpenses: number;
  setFuneralExpenses: React.Dispatch<React.SetStateAction<number>>;
  bequests: number;
  setBequests: React.Dispatch<React.SetStateAction<number>>;
  currency: string;
  setCurrency: React.Dispatch<React.SetStateAction<string>>;
  onCalculateNetEstate: () => void;
}

const EstateForm: React.FC<EstateFormProps> = ({
  totalAssets,
  setTotalAssets,
  totalDebts,
  setTotalDebts,
  funeralExpenses,
  setFuneralExpenses,
  bequests,
  setBequests,
  currency,
  setCurrency,
  onCalculateNetEstate
}) => {
  const { t, language } = useLanguage();
  
  return (
    <Card className="mb-6 shadow-sm border-islamic-primary/20">
      <CardHeader className="bg-gradient-to-r from-islamic-primary/5 to-islamic-secondary/5 border-b border-islamic-primary/10">
        <CardTitle className="text-xl text-islamic-primary flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4a2 2 0 00-2 2v1h16V6a2 2 0 00-2-2H4z"></path>
            <path fillRule="evenodd" d="M18 9H2v5a2 2 0 002 2h12a2 2 0 002-2V9zM4 13a1 1 0 011-1h1a1 1 0 110 2H5a1 1 0 01-1-1zm5-1a1 1 0 100 2h1a1 1 0 100-2H9z" clipRule="evenodd"></path>
          </svg>
          {t('estate.title')}
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="totalAssets" className="text-islamic-dark self-center">
                {t('estate.totalAssets')}
              </Label>
              <div className="w-2/3">
                <div className="relative">
                  <Input
                    id="totalAssets"
                    type="number"
                    min="0"
                    value={totalAssets || ''}
                    onChange={(e) => setTotalAssets(parseFloat(e.target.value) || 0)}
                    className="text-left pl-8 pr-2"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-islamic-dark/70">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Label htmlFor="totalDebts" className="text-islamic-dark self-center">
                {t('estate.totalDebts')}
              </Label>
              <div className="w-2/3">
                <div className="relative">
                  <Input
                    id="totalDebts"
                    type="number"
                    min="0"
                    value={totalDebts || ''}
                    onChange={(e) => setTotalDebts(parseFloat(e.target.value) || 0)}
                    className="text-left pl-8 pr-2"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-islamic-dark/70">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="space-y-3">
            <div className="flex justify-between">
              <Label htmlFor="funeralExpenses" className="text-islamic-dark self-center">
                {t('estate.funeralExpenses')}
              </Label>
              <div className="w-2/3">
                <div className="relative">
                  <Input
                    id="funeralExpenses"
                    type="number"
                    min="0"
                    value={funeralExpenses || ''}
                    onChange={(e) => setFuneralExpenses(parseFloat(e.target.value) || 0)}
                    className="text-left pl-8 pr-2"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-islamic-dark/70">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex justify-between">
              <Label htmlFor="bequests" className="text-islamic-dark self-center">
                {t('estate.bequests')}
              </Label>
              <div className="w-2/3">
                <div className="relative">
                  <Input
                    id="bequests"
                    type="number"
                    min="0"
                    value={bequests || ''}
                    onChange={(e) => setBequests(parseFloat(e.target.value) || 0)}
                    className="text-left pl-8 pr-2"
                  />
                  <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-islamic-dark/70">
                    {currency}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-8">
          <div className="flex items-center space-x-2 rtl:space-x-reverse">
            <Label htmlFor="currency" className="text-islamic-dark whitespace-nowrap">
              {t('estate.currency')}
            </Label>
            <Select value={currency} onValueChange={setCurrency}>
              <SelectTrigger className="w-20 border-islamic-primary/30">
                <SelectValue placeholder={currency} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="USD">USD</SelectItem>
                <SelectItem value="EUR">EUR</SelectItem>
                <SelectItem value="SAR">SAR</SelectItem>
                <SelectItem value="AED">AED</SelectItem>
                <SelectItem value="EGP">EGP</SelectItem>
                <SelectItem value="KWD">KWD</SelectItem>
                <SelectItem value="YER">YER</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <Button 
            onClick={onCalculateNetEstate}
            className="bg-islamic-primary hover:bg-islamic-accent text-white"
          >
            {t('estate.calculate')}
          </Button>
        </div>

        <div className="mt-6 pt-4 border-t border-dashed border-islamic-primary/30">
          <div className="flex justify-between text-lg font-bold">
            <span className="text-islamic-dark">{t('estate.netEstate')}</span>
            <span className="text-islamic-primary">
              {(totalAssets - totalDebts - funeralExpenses - bequests).toLocaleString()} {currency}
            </span>
          </div>
          <div className="text-xs text-islamic-dark/70 mt-2 text-right">
            {t('estate.netEstateFormula')}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default EstateForm;
