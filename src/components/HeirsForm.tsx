
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Heir } from '@/utils/inheritanceCalculator';
import { v4 as uuidv4 } from '@/utils/uuid';
import { cn } from '@/lib/utils';

interface HeirsFormProps {
  selectedHeirs: Heir[];
  setSelectedHeirs: React.Dispatch<React.SetStateAction<Heir[]>>;
  onCalculateInheritance: () => void;
}

const HeirsForm: React.FC<HeirsFormProps> = ({
  selectedHeirs,
  setSelectedHeirs,
  onCalculateInheritance
}) => {
  // Toggle heir selection
  const toggleHeir = (type: Heir['type']) => {
    // Check if this type of heir is already selected
    const existingIndex = selectedHeirs.findIndex(heir => heir.type === type);
    
    if (existingIndex >= 0) {
      // Remove the heir
      setSelectedHeirs(prev => prev.filter((_, i) => i !== existingIndex));
    } else {
      // Add the heir
      setSelectedHeirs(prev => [
        ...prev, 
        { id: uuidv4(), type, count: type === 'wife' || type.includes('son') || type.includes('daughter') || type.includes('Brother') || type.includes('Sister') ? 1 : undefined }
      ]);
    }
  };
  
  // Update heir count
  const updateHeirCount = (id: string, count: number) => {
    setSelectedHeirs(prev => 
      prev.map(heir => 
        heir.id === id ? { ...heir, count } : heir
      )
    );
  };
  
  // Check if a heir type is selected
  const isSelected = (type: Heir['type']): boolean => {
    return selectedHeirs.some(heir => heir.type === type);
  };
  
  // Get the count for a specific heir
  const getHeirCount = (id: string): number => {
    const heir = selectedHeirs.find(h => h.id === id);
    return heir?.count || 1;
  };

  return (
    <Card className="mb-6 shadow-sm border-islamic-primary/20">
      <CardHeader className="bg-gradient-to-r from-islamic-primary/5 to-islamic-secondary/5 border-b border-islamic-primary/10">
        <CardTitle className="text-xl text-islamic-primary flex items-center">
          <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
            <path d="M13 6a3 3 0 11-6 0 3 3 0 016 0zM18 8a2 2 0 11-4 0 2 2 0 014 0zM14 15a4 4 0 00-8 0v3h8v-3zM6 8a2 2 0 11-4 0 2 2 0 014 0zM16 18v-3a5.972 5.972 0 00-.75-2.906A3.005 3.005 0 0119 15v3h-3zM4.75 12.094A5.973 5.973 0 004 15v3H1v-3a3 3 0 013.75-2.906z"></path>
          </svg>
          الورثة
        </CardTitle>
      </CardHeader>
      <CardContent className="pt-6">
        <Tabs defaultValue="immediate" className="w-full">
          <TabsList className="grid grid-cols-3 mb-6">
            <TabsTrigger value="immediate">الورثة المباشرين</TabsTrigger>
            <TabsTrigger value="parents">الوالدين والأجداد</TabsTrigger>
            <TabsTrigger value="siblings">الإخوة والأخوات</TabsTrigger>
          </TabsList>
          
          <TabsContent value="immediate" className="space-y-4">
            {/* Spouses */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('husband') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('husband')}
                    onCheckedChange={() => toggleHeir('husband')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('husband')}>
                    الزوج
                  </Label>
                </div>
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('wife') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('wife')}
                    onCheckedChange={() => toggleHeir('wife')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('wife')}>
                    الزوجة / الزوجات
                  </Label>
                </div>
                
                {isSelected('wife') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="wifeCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="wifeCount"
                      type="number"
                      min="1"
                      max="4"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'wife')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'wife')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
            </div>
            
            {/* Children */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('son') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('son')}
                    onCheckedChange={() => toggleHeir('son')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('son')}>
                    الأبناء
                  </Label>
                </div>
                
                {isSelected('son') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="sonCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="sonCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'son')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'son')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('daughter') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('daughter')}
                    onCheckedChange={() => toggleHeir('daughter')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('daughter')}>
                    البنات
                  </Label>
                </div>
                
                {isSelected('daughter') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="daughterCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="daughterCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'daughter')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'daughter')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="parents" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('father') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('father')}
                    onCheckedChange={() => toggleHeir('father')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('father')}>
                    الأب
                  </Label>
                </div>
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('mother') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('mother')}
                    onCheckedChange={() => toggleHeir('mother')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('mother')}>
                    الأم
                  </Label>
                </div>
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('grandfather') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('grandfather')}
                    onCheckedChange={() => toggleHeir('grandfather')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('grandfather')}>
                    الجد (من جهة الأب)
                  </Label>
                </div>
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('grandmother') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('grandmother')}
                    onCheckedChange={() => toggleHeir('grandmother')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('grandmother')}>
                    الجدة
                  </Label>
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="siblings" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('brother') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('brother')}
                    onCheckedChange={() => toggleHeir('brother')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('brother')}>
                    الأخ الشقيق
                  </Label>
                </div>
                
                {isSelected('brother') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="brotherCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="brotherCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'brother')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'brother')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('sister') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('sister')}
                    onCheckedChange={() => toggleHeir('sister')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('sister')}>
                    الأخت الشقيقة
                  </Label>
                </div>
                
                {isSelected('sister') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="sisterCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="sisterCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'sister')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'sister')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('paternalBrother') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('paternalBrother')}
                    onCheckedChange={() => toggleHeir('paternalBrother')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('paternalBrother')}>
                    الأخ لأب
                  </Label>
                </div>
                
                {isSelected('paternalBrother') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="paternalBrotherCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="paternalBrotherCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'paternalBrother')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'paternalBrother')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('paternalSister') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('paternalSister')}
                    onCheckedChange={() => toggleHeir('paternalSister')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('paternalSister')}>
                    الأخت لأب
                  </Label>
                </div>
                
                {isSelected('paternalSister') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="paternalSisterCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="paternalSisterCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'paternalSister')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'paternalSister')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('maternalBrother') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('maternalBrother')}
                    onCheckedChange={() => toggleHeir('maternalBrother')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('maternalBrother')}>
                    الأخ لأم
                  </Label>
                </div>
                
                {isSelected('maternalBrother') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="maternalBrotherCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="maternalBrotherCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'maternalBrother')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'maternalBrother')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
              
              <div className={cn(
                "heir-card flex justify-between items-center",
                isSelected('maternalSister') && "ring-1 ring-islamic-primary/30 bg-islamic-primary/5"
              )}>
                <div className="flex items-center">
                  <Switch 
                    checked={isSelected('maternalSister')}
                    onCheckedChange={() => toggleHeir('maternalSister')}
                    className="mr-3 data-[state=checked]:bg-islamic-primary"
                  />
                  <Label className="cursor-pointer" onClick={() => toggleHeir('maternalSister')}>
                    الأخت لأم
                  </Label>
                </div>
                
                {isSelected('maternalSister') && (
                  <div className="flex items-center space-x-2 rtl:space-x-reverse">
                    <Label htmlFor="maternalSisterCount" className="whitespace-nowrap">العدد:</Label>
                    <Input 
                      id="maternalSisterCount"
                      type="number"
                      min="1"
                      value={getHeirCount(selectedHeirs.find(h => h.type === 'maternalSister')?.id || '')}
                      onChange={(e) => updateHeirCount(
                        selectedHeirs.find(h => h.type === 'maternalSister')?.id || '',
                        parseInt(e.target.value) || 1
                      )}
                      className="w-16 text-center"
                    />
                  </div>
                )}
              </div>
            </div>
          </TabsContent>
        </Tabs>
        
        <div className="mt-8 pt-4 border-t border-dashed border-islamic-primary/30">
          <div className="mb-4">
            <h3 className="text-lg font-bold text-islamic-primary">الورثة المختارون:</h3>
            {selectedHeirs.length === 0 ? (
              <p className="text-islamic-dark/70 italic">لم يتم اختيار أي وارث بعد</p>
            ) : (
              <div className="flex flex-wrap gap-2 mt-2">
                {selectedHeirs.map(heir => {
                  const heirNames: Record<Heir['type'], string> = {
                    husband: "الزوج",
                    wife: `الزوجة${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    son: `الابن${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    daughter: `البنت${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    father: "الأب",
                    mother: "الأم",
                    grandfather: "الجد",
                    grandmother: "الجدة",
                    brother: `الأخ الشقيق${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    sister: `الأخت الشقيقة${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    paternalBrother: `الأخ لأب${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    paternalSister: `الأخت لأب${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    maternalBrother: `الأخ لأم${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`,
                    maternalSister: `الأخت لأم${heir.count && heir.count > 1 ? ` (${heir.count})` : ''}`
                  };
                  
                  return (
                    <div 
                      key={heir.id} 
                      className="bg-islamic-primary/10 text-islamic-dark px-3 py-1 rounded-full flex items-center gap-2"
                    >
                      <span>{heirNames[heir.type]}</span>
                      <button 
                        onClick={() => toggleHeir(heir.type)}
                        className="inline-flex h-4 w-4 rounded-full items-center justify-center bg-islamic-primary/20 text-islamic-dark hover:bg-islamic-primary/40"
                      >
                        ×
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
          
          <Button 
            onClick={onCalculateInheritance}
            disabled={selectedHeirs.length === 0}
            className="bg-islamic-primary hover:bg-islamic-accent text-white w-full"
          >
            حساب الميراث
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default HeirsForm;
