// Nepali Calendar utility functions based on actual Nepali Patro
// This provides accurate Bikram Sambat (BS) conversion

interface NepaliDate {
  year: number;
  month: number;
  day: number;
  monthName: string;
}

// Nepali month names
const nepaliMonths = [
  'बैशाख', 'जेठ', 'आषाढ', 'श्रावण', 'भदौ', 'आश्विन',
  'कार्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत्र'
];

// Days in each Nepali month for recent years (this would need to be extended for full calendar)
const nepaliCalendarData: { [year: number]: number[] } = {
  2081: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2024-2025 BS
  2082: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30], // 2025-2026 BS
  2083: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 30], // 2026-2027 BS
};

// Base date: 2000-04-14 AD = 2057-01-01 BS
const baseAdDate = new Date(2000, 3, 14); // April 14, 2000
const baseBsYear = 2057;
const baseBsMonth = 1;
const baseBsDay = 1;

export function adToBs(adDate: Date): NepaliDate {
  // Calculate difference in days from base date
  const diffTime = adDate.getTime() - baseAdDate.getTime();
  const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  
  // Start from base BS date
  let bsYear = baseBsYear;
  let bsMonth = baseBsMonth;
  let bsDay = baseBsDay;
  let remainingDays = diffDays;
  
  // Add days to get the correct BS date
  while (remainingDays > 0) {
    const daysInCurrentMonth = getDaysInNepaliMonth(bsYear, bsMonth);
    const daysLeftInMonth = daysInCurrentMonth - bsDay + 1;
    
    if (remainingDays >= daysLeftInMonth) {
      remainingDays -= daysLeftInMonth;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
      bsDay = 1;
    } else {
      bsDay += remainingDays;
      remainingDays = 0;
    }
  }
  
  // Handle negative days (going backward)
  while (remainingDays < 0) {
    bsDay += remainingDays;
    if (bsDay <= 0) {
      bsMonth--;
      if (bsMonth <= 0) {
        bsMonth = 12;
        bsYear--;
      }
      const daysInPrevMonth = getDaysInNepaliMonth(bsYear, bsMonth);
      bsDay += daysInPrevMonth;
      remainingDays = 0;
    } else {
      remainingDays = 0;
    }
  }
  
  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    monthName: nepaliMonths[bsMonth - 1]
  };
}

function getDaysInNepaliMonth(year: number, month: number): number {
  // Use predefined data for known years, fallback to approximate
  if (nepaliCalendarData[year]) {
    return nepaliCalendarData[year][month - 1];
  }
  
  // Fallback approximation for years not in our data
  if (month === 1 || month === 2) return 31;
  if (month === 3 || month === 4) return 32;
  if (month === 5) return 31;
  if (month === 6 || month === 7) return 30;
  if (month === 8) return 29;
  if (month === 9 || month === 11 || month === 12) return 30;
  if (month === 10) return 29;
  return 30;
}

export function formatNepaliDate(nepaliDate: NepaliDate): string {
  return `${nepaliDate.year}/${String(nepaliDate.month).padStart(2, '0')}/${String(nepaliDate.day).padStart(2, '0')}`;
}

export function formatNepaliDateWithMonth(nepaliDate: NepaliDate): string {
  return `${nepaliDate.day} ${nepaliDate.monthName} ${nepaliDate.year}`;
}

export function getCurrentNepaliDate(): NepaliDate {
  return adToBs(new Date());
}

// Nepali holidays data
export interface NepaliHoliday {
  name: string;
  description: string;
  type: 'festival' | 'national' | 'religious';
}

// Major Nepali holidays by BS date (year-month-day format)
const nepaliHolidays: { [key: string]: NepaliHoliday } = {
  // 2082 holidays
  '2082-1-1': { name: 'नयाँ वर्ष', description: 'Nepali New Year', type: 'national' },
  '2082-1-18': { name: 'लोकतन्त्र दिवस', description: 'Democracy Day', type: 'national' },
  '2082-3-5': { name: 'कुशे औंसी', description: 'Gokarna Aunsi (Father\'s Day)', type: 'festival' },
  '2082-4-3': { name: 'जनै पूर्णिमा', description: 'Janai Purnima', type: 'religious' },
  '2082-4-8': { name: 'गाईजात्रा', description: 'Gai Jatra', type: 'festival' },
  '2082-5-15': { name: 'कृष्ण जन्माष्टमी', description: 'Krishna Janmashtami', type: 'religious' },
  '2082-6-2': { name: 'तीज', description: 'Haritalika Teej', type: 'festival' },
  '2082-6-10': { name: 'इन्द्र जात्रा', description: 'Indra Jatra Festival', type: 'festival' },
  '2082-6-17': { name: 'दशैं', description: 'Dashain Festival Begins', type: 'festival' },
  '2082-7-11': { name: 'तिहार', description: 'Deepawali/Tihar', type: 'festival' },
  '2082-8-30': { name: 'संविधान दिवस', description: 'Constitution Day', type: 'national' },
  '2082-10-1': { name: 'प्रजातन्त्र दिवस', description: 'International Democracy Day', type: 'national' },
  '2082-10-16': { name: 'शिव रात्री', description: 'Maha Shivaratri', type: 'religious' },
  '2082-12-8': { name: 'होली', description: 'Holi Festival', type: 'festival' },
};

export function isNepaliHoliday(nepaliDate: NepaliDate): NepaliHoliday | null {
  const dateKey = `${nepaliDate.year}-${nepaliDate.month}-${nepaliDate.day}`;
  return nepaliHolidays[dateKey] || null;
}

export function getNepaliHoliday(nepaliDate: NepaliDate): NepaliHoliday | null {
  return isNepaliHoliday(nepaliDate);
}