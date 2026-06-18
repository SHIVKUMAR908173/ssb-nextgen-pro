import React from 'react';
import { Check, X } from 'lucide-react';

interface PasswordStrengthMeterProps {
  password: string;
}

export function PasswordStrengthMeter({ password }: PasswordStrengthMeterProps) {
  // Define rules
  const rules = [
    { label: 'Minimum 12 characters', check: (pwd: string) => pwd.length >= 12 },
    { label: 'At least 1 uppercase letter', check: (pwd: string) => /[A-Z]/.test(pwd) },
    { label: 'At least 1 lowercase letter', check: (pwd: string) => /[a-z]/.test(pwd) },
    { label: 'At least 1 digit', check: (pwd: string) => /[0-9]/.test(pwd) },
    { label: 'At least 1 special character', check: (pwd: string) => /[^A-Za-z0-9]/.test(pwd) },
  ];

  // Calculate score based on rules
  const passedRules = rules.filter(r => r.check(password)).length;
  
  // Extra entropy checks
  let extraScore = 0;
  if (password.length > 15) extraScore += 1;
  if (/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9])/.test(password) && password.length >= 12) {
      if (!/(.)\1{2,}/.test(password)) extraScore += 1; // No repeated chars like 'aaa'
      if (!/(abc|123|qwerty|password)/i.test(password)) extraScore += 1; // No common sequences
  }

  // Cap score at 5 for the meter
  const score = Math.min(5, Math.floor((passedRules / rules.length) * 3) + extraScore);
  
  let strengthLabel = 'Very Weak';
  let colorClass = 'bg-red-500';
  let textColorClass = 'text-red-500';

  if (password.length === 0) {
    strengthLabel = 'Enter password';
    colorClass = 'bg-slate-700';
    textColorClass = 'text-slate-500';
  } else if (score <= 1) {
    strengthLabel = 'Very Weak';
    colorClass = 'bg-red-500';
    textColorClass = 'text-red-500';
  } else if (score === 2) {
    strengthLabel = 'Weak';
    colorClass = 'bg-orange-500';
    textColorClass = 'text-orange-500';
  } else if (score === 3) {
    strengthLabel = 'Fair';
    colorClass = 'bg-yellow-500';
    textColorClass = 'text-yellow-500';
  } else if (score === 4) {
    strengthLabel = 'Strong';
    colorClass = 'bg-lime-500';
    textColorClass = 'text-lime-500';
  } else {
    strengthLabel = 'Very Strong';
    colorClass = 'bg-green-500';
    textColorClass = 'text-green-500';
  }

  // Calculate percentage for progress bar (each segment is 20%)
  const percentage = password.length === 0 ? 0 : Math.max(10, score * 20);

  return (
    <div className="w-full space-y-3 mt-2">
      <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest">
        <span className="text-slate-500">Password Strength</span>
        <span className={textColorClass}>{strengthLabel}</span>
      </div>
      
      {/* Visual meter */}
      <div className="flex gap-1 h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
        {[1, 2, 3, 4, 5].map((segment) => (
          <div
            key={segment}
            className={`h-full flex-1 transition-colors duration-300 ${
              password.length > 0 && score >= segment ? colorClass : 'bg-transparent'
            }`}
          />
        ))}
      </div>

      {/* Rules checklist */}
      <div className="space-y-1.5 pt-2">
        {rules.map((rule, idx) => {
          const isPassed = rule.check(password);
          return (
            <div key={idx} className="flex items-center gap-2 text-xs">
              {isPassed ? (
                <Check size={14} className="text-green-500" />
              ) : (
                <X size={14} className="text-slate-600" />
              )}
              <span className={isPassed ? 'text-slate-300' : 'text-slate-500'}>
                {rule.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}
