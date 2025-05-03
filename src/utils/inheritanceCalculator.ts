// Inheritance calculation functions based on Islamic law (Fiqh al-Mawarith)

export type Heir = {
  id: string;
  type: 'husband' | 'wife' | 'son' | 'daughter' | 'father' | 'mother' | 'brother' | 'sister' | 'paternalBrother' | 'paternalSister' | 'maternalBrother' | 'maternalSister' | 'grandfather' | 'grandmother';
  count?: number; // For multiple heirs of same type (like multiple daughters)
  share?: number; // Calculated share
  shareText?: string; // Fraction as text (e.g., "1/2", "2/3")
  sharePercentage?: number; // Percentage representation
  shareAmount?: number; // Actual amount in currency
  reasoning?: string; // Explanation of the calculation
  quranReference?: string; // Reference to Quran verses
};

export type Estate = {
  totalAssets: number;
  totalDebts: number;
  funeralExpenses: number;
  bequests: number;
  netEstate: number;
  currency: string;
};

// Calculate the net estate after debts, funeral expenses and bequests
export const calculateNetEstate = (estate: Omit<Estate, 'netEstate'>): number => {
  return Math.max(0, estate.totalAssets - estate.totalDebts - estate.funeralExpenses - estate.bequests);
};

// Helper function to find GCD for fraction simplification
const gcd = (a: number, b: number): number => {
  return b ? gcd(b, a % b) : a;
};

// Helper function to convert share to fraction text
export const toFractionText = (share: number): string => {
  if (share === 0) return "0";
  if (share === 1) return "1";
  
  // Convert decimal to fraction
  const precision = 1000000;
  const numerator = Math.round(share * precision);
  const denominator = precision;
  const divisor = gcd(numerator, denominator);
  
  return `${numerator / divisor}/${denominator / divisor}`;
};

// Convert from number to Arabic ordinal
export const getArabicOrdinal = (num: number): string => {
  const ordinals = [
    "الأول", "الثاني", "الثالث", "الرابع", "الخامس", 
    "السادس", "السابع", "الثامن", "التاسع", "العاشر"
  ];
  
  if (num >= 1 && num <= ordinals.length) {
    return ordinals[num - 1];
  }
  return `${num}`;
};

// Main function to calculate inheritance shares
export const calculateInheritance = (heirs: Heir[], estate: Omit<Estate, 'netEstate'>): {
  heirs: Heir[],
  estate: Estate,
  aul: boolean,  // Whether Aul (increase in denominator) was applied
  radd: boolean  // Whether Radd (redistribution of remainder) was applied
} => {
  // Calculate net estate
  const netEstate = calculateNetEstate(estate);
  const completeEstate: Estate = { ...estate, netEstate };
  
  // Clone the heirs array to avoid modifying the original
  let calculatedHeirs = [...heirs];
  
  // Step 1: Identify the presence of primary heirs
  const hasChildren = calculatedHeirs.some(heir => 
    heir.type === 'son' || heir.type === 'daughter'
  );
  
  const hasMaleChildren = calculatedHeirs.some(heir => heir.type === 'son');
  
  const hasFather = calculatedHeirs.some(heir => heir.type === 'father');
  const hasMother = calculatedHeirs.some(heir => heir.type === 'mother');
  
  const hasSpouse = calculatedHeirs.some(heir => 
    heir.type === 'husband' || heir.type === 'wife'
  );
  
  // Step 2: Assign prescribed shares (Furud) based on Quran and Hadith
  calculatedHeirs = calculatedHeirs.map(heir => {
    let share = 0;
    let reasoning = "";
    let quranReference = "";
    
    // Husband
    if (heir.type === 'husband') {
      if (!hasChildren) {
        share = 1/2; // Half if no children
        reasoning = "الزوج يرث النصف عندما لا يوجد أولاد";
        quranReference = "سورة النساء، آية 12";
      } else {
        share = 1/4; // Quarter if there are children
        reasoning = "الزوج يرث الربع عند وجود الأولاد";
        quranReference = "سورة النساء، آية 12";
      }
    }
    
    // Wife
    else if (heir.type === 'wife') {
      // Adjust share based on count (multiple wives share the same portion)
      const count = heir.count || 1;
      
      if (!hasChildren) {
        share = (1/4) / count; // Quarter divided among wives if no children
        reasoning = `الزوجة ترث الربع عندما لا يوجد أولاد (مقسم على ${count} زوجات)`;
        quranReference = "سورة النساء، آية 12";
      } else {
        share = (1/8) / count; // Eighth divided among wives if there are children
        reasoning = `الزوجة ترث الثمن عند وجود الأولاد (مقسم على ${count} زوجات)`;
        quranReference = "سورة النساء، آية 12";
      }
    }
    
    // Father
    else if (heir.type === 'father') {
      if (hasChildren) {
        share = 1/6; // Sixth if there are children
        reasoning = "الأب يرث السدس مع وجود الأولاد";
        quranReference = "سورة النساء، آية 11";
      } else {
        // Father takes all as Asaba (residue) if he is the only heir
        // This is simplified - in reality, he would take prescribed share + residue
        share = 1; // Will be adjusted later in residue calculation
        reasoning = "الأب يرث كل التركة كعاصب إذا لم يوجد أولاد";
        quranReference = "سورة النساء، آية 11";
      }
    }
    
    // Mother
    else if (heir.type === 'mother') {
      // Check for the "Gharrawayn" case (specific case for parents)
      const siblings = calculatedHeirs.filter(h => 
        h.type === 'brother' || h.type === 'sister' || 
        h.type === 'paternalBrother' || h.type === 'paternalSister' ||
        h.type === 'maternalBrother' || h.type === 'maternalSister'
      );
      
      if (hasChildren || siblings.length >= 2) {
        share = 1/6; // Sixth if there are children or multiple siblings
        reasoning = hasChildren 
          ? "الأم ترث السدس مع وجود الأولاد"
          : "الأم ترث السدس مع وجود اثنين أو أكثر من الإخوة";
        quranReference = "سورة النساء، آية 11";
      } else {
        share = 1/3; // Third otherwise
        reasoning = "الأم ترث الثلث عند عدم وجود أولاد وأقل من اثنين من الإخوة";
        quranReference = "سورة النساء، آية 11";
      }
    }
    
    // Son - Asaba (residual heir)
    else if (heir.type === 'son') {
      // Sons are Asaba and share will be calculated after prescribed shares
      share = 0; // Placeholder, will be calculated in residue distribution
      reasoning = "الابن يرث بالتعصيب ويحصل على الباقي بعد أصحاب الفروض";
      quranReference = "سورة النساء، آية 11";
    }
    
    // Daughter
    else if (heir.type === 'daughter') {
      if (!hasMaleChildren) {
        const daughters = calculatedHeirs.filter(h => h.type === 'daughter');
        const daughterCount = daughters.length;
        
        if (daughterCount === 1) {
          share = 1/2; // Half if only one daughter and no son
          reasoning = "البنت الوحيدة ترث النصف";
          quranReference = "سورة النساء، آية 11";
        } else {
          share = 2/3 / daughterCount; // Two-thirds shared among daughters
          reasoning = `البنات يرثن الثلثين بالتساوي (${2/3 / daughterCount} لكل بنت)`;
          quranReference = "سورة النساء، آية 11";
        }
      } else {
        // When sons exist, daughters are Asaba with them (son gets twice daughter's share)
        share = 0; // Placeholder, will be calculated in residue distribution
        reasoning = "البنت ترث بالتعصيب مع الابن (للذكر مثل حظ الأنثيين)";
        quranReference = "سورة النساء، آية 11";
      }
    }
    
    // Full Brother - Asaba or blocked
    else if (heir.type === 'brother') {
      if (!hasChildren && !hasFather) {
        // Full brothers inherit as Asaba if no children or father
        share = 0; // Placeholder for Asaba
        reasoning = "الأخ الشقيق يرث بالتعصيب عند عدم وجود الأب والأبناء";
        quranReference = "سورة النساء، آية 176";
      } else {
        // Full brothers are blocked by sons or father
        share = 0;
        reasoning = "الأخ الشقيق محجوب بوجود الأب أو الابن";
      }
    }
    
    // Full Sister
    else if (heir.type === 'sister') {
      if (!hasChildren && !hasFather) {
        const sisters = calculatedHeirs.filter(h => h.type === 'sister');
        const brothersExist = calculatedHeirs.some(h => h.type === 'brother');
        
        if (!brothersExist) {
          if (sisters.length === 1) {
            share = 1/2; // Half if only one sister
            reasoning = "الأخت الشقيقة الوحيدة ترث النصف";
            quranReference = "سورة النساء، آية 176";
          } else {
            share = 2/3 / sisters.length; // Two-thirds shared among sisters
            reasoning = "الأخوات الشقيقات يرثن الثلثين بالتساوي";
            quranReference = "سورة النساء، آية 176";
          }
        } else {
          share = 0; // Placeholder for Asaba with brothers
          reasoning = "الأخت الشقيقة ترث بالتعصيب مع الأخ الشقيق (للذكر مثل حظ الأنثيين)";
          quranReference = "سورة النساء، آية 176";
        }
      } else {
        share = 0;
        reasoning = "الأخت الشقيقة محجوبة بوجود الأب أو الابن";
      }
    }
    
    // Other types of heirs would follow similar patterns
    // This is a simplified implementation
    
    return {
      ...heir,
      share,
      reasoning,
      quranReference,
      shareText: toFractionText(share),
      sharePercentage: share * 100,
      shareAmount: share * netEstate
    };
  });
  
  // Step 3: Calculate residue (Asaba) distribution
  let totalPrescribedShares = calculatedHeirs.reduce((total, heir) => total + heir.share!, 0);
  
  // Check if there's a residue to distribute
  const residue = Math.max(0, 1 - totalPrescribedShares);
  let aul = false;
  let radd = false;
  
  if (totalPrescribedShares > 1) {
    // Apply Aul - when prescribed shares exceed 1 (100%)
    aul = true;
    
    // Proportionally adjust all shares
    calculatedHeirs = calculatedHeirs.map(heir => {
      const adjustedShare = heir.share! / totalPrescribedShares;
      return {
        ...heir,
        share: adjustedShare,
        shareText: toFractionText(adjustedShare),
        sharePercentage: adjustedShare * 100,
        shareAmount: adjustedShare * netEstate,
        reasoning: heir.reasoning + " (تم تطبيق العول)"
      };
    });
  } else if (residue > 0) {
    // Distribute residue among Asaba heirs
    const asabaHeirs = calculatedHeirs.filter(heir => 
      (heir.type === 'son') || 
      (heir.type === 'daughter' && calculatedHeirs.some(h => h.type === 'son')) ||
      (heir.type === 'father' && !hasChildren) ||
      (heir.type === 'brother' && !hasChildren && !hasFather) ||
      (heir.type === 'sister' && !hasChildren && !hasFather && calculatedHeirs.some(h => h.type === 'brother'))
    );
    
    if (asabaHeirs.length > 0) {
      // Calculate the total units for distribution (2 for males, 1 for females)
      let totalUnits = 0;
      asabaHeirs.forEach(heir => {
        if (heir.type === 'son' || heir.type === 'father' || heir.type === 'brother') {
          totalUnits += 2 * (heir.count || 1);
        } else {
          totalUnits += 1 * (heir.count || 1);
        }
      });
      
      // Distribute residue according to units
      calculatedHeirs = calculatedHeirs.map(heir => {
        if (asabaHeirs.some(asaba => asaba.id === heir.id)) {
          const units = (heir.type === 'son' || heir.type === 'father' || heir.type === 'brother') 
            ? 2 * (heir.count || 1) 
            : 1 * (heir.count || 1);
          
          const asabaShare = (residue * units) / totalUnits;
          const totalShare = heir.share! + asabaShare;
          
          return {
            ...heir,
            share: totalShare,
            shareText: toFractionText(totalShare),
            sharePercentage: totalShare * 100,
            shareAmount: totalShare * netEstate,
            reasoning: heir.reasoning + ` (يأخذ من الباقي ${toFractionText(asabaShare)})`
          };
        }
        return heir;
      });
    } else {
      // Apply Radd - redistribution of remainder to prescribed heirs (except spouses)
      if (residue > 0) {
        radd = true;
        
        // Eligible heirs for Radd (all prescribed heirs except spouses)
        const raddHeirs = calculatedHeirs.filter(heir => 
          heir.share! > 0 && heir.type !== 'husband' && heir.type !== 'wife'
        );
        
        if (raddHeirs.length > 0) {
          // Calculate total shares of Radd-eligible heirs
          const totalRaddShares = raddHeirs.reduce((total, heir) => total + heir.share!, 0);
          
          // Distribute residue proportionally
          calculatedHeirs = calculatedHeirs.map(heir => {
            if (raddHeirs.some(raddHeir => raddHeir.id === heir.id)) {
              const proportion = heir.share! / totalRaddShares;
              const additionalShare = residue * proportion;
              const totalShare = heir.share! + additionalShare;
              
              return {
                ...heir,
                share: totalShare,
                shareText: toFractionText(totalShare),
                sharePercentage: totalShare * 100,
                shareAmount: totalShare * netEstate,
                reasoning: heir.reasoning + " (مع الرد)"
              };
            }
            return heir;
          });
        }
      }
    }
  }
  
  return {
    heirs: calculatedHeirs,
    estate: completeEstate,
    aul,
    radd
  };
};
