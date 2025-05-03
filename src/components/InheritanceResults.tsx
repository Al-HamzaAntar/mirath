
import React from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { Heir, Estate } from '@/utils/inheritanceCalculator';

interface InheritanceResultsProps {
  heirs: Heir[];
  estate: Estate;
  aul: boolean;
  radd: boolean;
  onPrint: () => void;
  onReset: () => void;
}

interface CustomLabelProps {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
  index: number;
}

const COLORS = ['#10B981', '#047857', '#059669', '#34D399', '#6EE7B7', '#A7F3D0', '#D1FAE5', '#ECFDF5'];

// Helper function to get Arabic name for heir type
const getHeirArabicName = (heir: Heir): string => {
  const heirNames: Record<Heir['type'], string> = {
    husband: "الزوج",
    wife: "الزوجة",
    son: "الابن",
    daughter: "البنت",
    father: "الأب",
    mother: "الأم",
    grandfather: "الجد",
    grandmother: "الجدة",
    brother: "الأخ الشقيق",
    sister: "الأخت الشقيقة",
    paternalBrother: "الأخ لأب",
    paternalSister: "الأخت لأب",
    maternalBrother: "الأخ لأم",
    maternalSister: "الأخت لأم"
  };
  
  const name = heirNames[heir.type];
  const count = heir.count && heir.count > 1 ? ` (${heir.count})` : '';
  return `${name}${count}`;
};

const InheritanceResults: React.FC<InheritanceResultsProps> = ({
  heirs,
  estate,
  aul,
  radd,
  onPrint,
  onReset
}) => {
  // Filter out heirs with zero share
  const heirsWithShare = heirs.filter(heir => heir.share && heir.share > 0);
  
  // Prepare data for chart
  const chartData = heirsWithShare.map(heir => ({
    name: getHeirArabicName(heir),
    value: heir.sharePercentage,
    amount: heir.shareAmount
  }));

  return (
    <div className="print:block" id="inheritance-results">
      <Card className="mb-6 shadow-sm border-islamic-primary/20">
        <CardHeader className="bg-gradient-to-r from-islamic-primary/10 to-islamic-secondary/10 border-b border-islamic-primary/10">
          <div className="flex justify-between items-center">
            <CardTitle className="text-xl text-islamic-primary flex items-center">
              <svg className="w-6 h-6 mr-2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1.323l3.954 1.582 1.599-.8a1 1 0 01.894 1.79l-1.233.616 1.738 5.42a1 1 0 01-.285 1.05A3.989 3.989 0 0115 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.715-5.349L11 6.477V16h2a1 1 0 110 2H7a1 1 0 110-2h2V6.477L6.237 7.582l1.715 5.349a1 1 0 01-.285 1.05A3.989 3.989 0 015 15a3.989 3.989 0 01-2.667-1.019 1 1 0 01-.285-1.05l1.738-5.42-1.233-.617a1 1 0 01.894-1.788l1.599.799L9 4.323V3a1 1 0 011-1zm-5 8.274l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L5 10.274zm10 0l-.818 2.552c.25.112.526.174.818.174.292 0 .569-.062.818-.174L15 10.274z" clipRule="evenodd"></path>
              </svg>
              نتائج الميراث
            </CardTitle>
            <div className="hidden print:flex space-x-2 rtl:space-x-reverse">
              <div className="text-islamic-primary font-bold">
                حاسبة الميراث الإسلامي
              </div>
              <div className="text-islamic-dark/60">
                {new Date().toLocaleDateString('ar-SA')}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-bold text-islamic-primary mb-4">تفاصيل التركة:</h3>
              <div className="space-y-2 border-r-4 border-islamic-primary/20 pr-4">
                <div className="flex justify-between">
                  <span className="text-islamic-dark/70">إجمالي الأصول:</span>
                  <span className="font-semibold">{estate.totalAssets.toLocaleString()} {estate.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-islamic-dark/70">إجمالي الديون:</span>
                  <span className="font-semibold">- {estate.totalDebts.toLocaleString()} {estate.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-islamic-dark/70">مصاريف الجنازة:</span>
                  <span className="font-semibold">- {estate.funeralExpenses.toLocaleString()} {estate.currency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-islamic-dark/70">الوصية:</span>
                  <span className="font-semibold">- {estate.bequests.toLocaleString()} {estate.currency}</span>
                </div>
                <div className="border-t border-islamic-primary/20 pt-2 mt-2">
                  <div className="flex justify-between font-bold">
                    <span className="text-islamic-dark">صافي التركة للتوزيع:</span>
                    <span className="text-islamic-primary">
                      {estate.netEstate.toLocaleString()} {estate.currency}
                    </span>
                  </div>
                </div>
              </div>
              
              <div className="verse-box mt-6">
                <p className="text-sm text-islamic-dark/80 mb-2">قال الله تعالى:</p>
                <p className="arabic-text text-lg font-semibold text-islamic-dark">
                  {`يُوصِيكُمُ اللَّهُ فِي أَوْلَادِكُمْ ۖ لِلذَّكَرِ مِثْلُ حَظِّ الْأُنثَيَيْنِ`}
                </p>
                <p className="text-xs text-islamic-dark/60 mt-2 text-left">سورة النساء: 11</p>
              </div>

              {heirsWithShare.length > 0 && (
                <div className="mt-6 hidden lg:block">
                  <ResponsiveContainer width="100%" height={250}>
                    <PieChart>
                      <Pie
                        data={chartData}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        nameKey="name"
                        label={({name, percent}) => `${name} ${(percent * 100).toFixed(1)}%`}
                      >
                        {chartData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip 
                        formatter={(value: number, name: string) => [
                          `${value.toFixed(1)}%`, 
                          name
                        ]} 
                      />
                      <Legend layout="vertical" align="right" verticalAlign="middle" />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              )}
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-islamic-primary mb-4">توزيع الأنصبة:</h3>
              
              {heirsWithShare.length === 0 ? (
                <div className="text-center p-10 border border-dashed border-islamic-primary/30 rounded-lg">
                  <p className="text-islamic-dark/70">
                    لا يوجد ورثة مستحقين للتركة أو المدخلات غير صحيحة
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {aul && (
                    <div className="bg-islamic-secondary/10 p-3 rounded-md mb-4 text-islamic-dark">
                      <div className="font-bold">تنبيه: تم تطبيق "العول"</div>
                      <p className="text-sm">
                        مجموع الأنصبة المحددة شرعًا تجاوز الواحد الصحيح، لذلك تم تخفيض نصيب كل وارث بشكل متناسب.
                      </p>
                    </div>
                  )}
                  
                  {radd && (
                    <div className="bg-islamic-primary/10 p-3 rounded-md mb-4 text-islamic-dark">
                      <div className="font-bold">تنبيه: تم تطبيق "الرد"</div>
                      <p className="text-sm">
                        مجموع الأنصبة المحددة أقل من الواحد الصحيح، وتم رد الباقي على أصحاب الفروض بحسب أنصبتهم باستثناء الزوجين.
                      </p>
                    </div>
                  )}
                  
                  <Tabs defaultValue="percentage" className="w-full">
                    <TabsList className="grid grid-cols-3 mb-4">
                      <TabsTrigger value="percentage">النسبة المئوية</TabsTrigger>
                      <TabsTrigger value="fraction">الكسور الشرعية</TabsTrigger>
                      <TabsTrigger value="amount">المبلغ</TabsTrigger>
                    </TabsList>
                    
                    <TabsContent value="percentage">
                      {heirsWithShare.map(heir => (
                        <div 
                          key={heir.id} 
                          className="flex justify-between p-3 border-b border-islamic-primary/10 hover:bg-islamic-primary/5 rounded"
                        >
                          <div className="flex items-center">
                            <span className="ml-2">{getHeirArabicName(heir)}</span>
                            
                            <div className="text-xs text-islamic-dark/70 max-w-[200px] hidden md:block">
                              ({heir.reasoning})
                            </div>
                          </div>
                          <div className="result-share">
                            {heir.sharePercentage?.toFixed(2)}%
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="fraction">
                      {heirsWithShare.map(heir => (
                        <div 
                          key={heir.id} 
                          className="flex justify-between p-3 border-b border-islamic-primary/10 hover:bg-islamic-primary/5 rounded"
                        >
                          <div className="flex items-center">
                            <span className="ml-2">{getHeirArabicName(heir)}</span>
                            <div className="text-xs text-islamic-dark/70 max-w-[200px] hidden md:block">
                              {heir.quranReference}
                            </div>
                          </div>
                          <div className="result-share">
                            {heir.shareText}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                    
                    <TabsContent value="amount">
                      {heirsWithShare.map(heir => (
                        <div 
                          key={heir.id} 
                          className="flex justify-between p-3 border-b border-islamic-primary/10 hover:bg-islamic-primary/5 rounded"
                        >
                          <span>{getHeirArabicName(heir)}</span>
                          <div className="result-share">
                            {heir.shareAmount?.toLocaleString()} {estate.currency}
                          </div>
                        </div>
                      ))}
                    </TabsContent>
                  </Tabs>
                </div>
              )}
              
              <div className="flex flex-wrap sm:flex-nowrap justify-between gap-3 mt-8">
                <Button
                  onClick={onReset}
                  className="bg-islamic-dark hover:bg-islamic-dark/80 text-white flex-1"
                >
                  إعادة الحساب
                </Button>
                <Button
                  onClick={onPrint}
                  className="bg-islamic-secondary hover:bg-islamic-secondary/80 text-white flex-1"
                >
                  طباعة النتائج
                </Button>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-islamic-primary/20 text-sm text-islamic-dark/60">
            <p className="arabic-text">
              ملاحظة: هذه الحاسبة هي أداة مساعدة فقط وتعتمد على المذهب السني، وينصح بالرجوع لأهل العلم والمتخصصين في علم الفرائض للحالات الخاصة.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InheritanceResults;
