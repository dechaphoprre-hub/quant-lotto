import React, { useState, useEffect } from 'react';
import { Language } from '../i18n/translations';
import { Clock } from 'lucide-react';

interface LiveServerClockProps {
  currentLang: Language;
}

export const LiveServerClock: React.FC<LiveServerClockProps> = ({ currentLang }) => {
  const [time, setTime] = useState(() => new Date());

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatDateTime = () => {
    const hours = String(time.getHours()).padStart(2, '0');
    const minutes = String(time.getMinutes()).padStart(2, '0');
    const seconds = String(time.getSeconds()).padStart(2, '0');
    const timeStr = `${hours}:${minutes}:${seconds}`;

    const day = time.getDate();
    const year = time.getFullYear();

    if (currentLang === 'TH') {
      const thDays = ['อา.', 'จ.', 'อ.', 'พ.', 'พฤ.', 'ศ.', 'ส.'];
      const thMonths = ['ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.', 'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'];
      const dayName = thDays[time.getDay()];
      const monthName = thMonths[time.getMonth()];
      const thYear = year + 543;
      return `${dayName} ${day} ${monthName} ${thYear} • ${timeStr} น.`;
    }

    if (currentLang === 'LA') {
      const laDays = ['ອາ.', 'ຈ.', 'ອ.', 'ພ.', 'ພຫ.', 'ສ.', 'ເສົາ'];
      const laMonths = ['ມ.ກ.', 'ກ.ພ.', 'ມ.ນ.', 'ເມ.ສ.', 'ພ.ພ.', 'ມິ.ຖ.', 'ກ.ລ.', 'ສ.ຫ.', 'ກ.ຍ.', 'ຕ.ລ.', 'ພ.ຈ.', 'ທ.ວ.'];
      const dayName = laDays[time.getDay()];
      const monthName = laMonths[time.getMonth()];
      return `${dayName} ${day} ${monthName} ${year} • ${timeStr}`;
    }

    if (currentLang === 'VN') {
      const vnDays = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
      const dayName = vnDays[time.getDay()];
      const month = String(time.getMonth() + 1).padStart(2, '0');
      return `${dayName}, ${day}/${month}/${year} • ${timeStr}`;
    }

    // Default EN
    const enDays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const enMonths = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const dayName = enDays[time.getDay()];
    const monthName = enMonths[time.getMonth()];
    return `${dayName}, ${day} ${monthName} ${year} • ${timeStr} (UTC+7)`;
  };

  return (
    <div className="flex items-center space-x-1.5 px-2.5 py-1 rounded-md bg-slate-950/80 border border-slate-800 text-xs font-mono text-slate-300 shrink-0">
      <Clock className="w-3.5 h-3.5 text-cyan-400 animate-pulse" />
      <span className="font-bold tracking-tight text-slate-200">
        {formatDateTime()}
      </span>
    </div>
  );
};
