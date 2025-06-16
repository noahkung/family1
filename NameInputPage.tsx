// client/src/pages/NameInputPage.tsx
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLanguage } from '@/hooks/useLanguage';
import { useAssessment } from '@/hooks/useAssessment';
import { useLocation } from 'wouter';

export function NameInputPage() {
  const { t } = useLanguage();
  const [, setLocation] = useLocation();
  const { userName, setUserName } = useAssessment();

  const [nameInput, setNameInput] = useState(userName || '');

  const handleContinue = () => {
    // เพิ่ม console.log ตรงนี้
    console.log('--- NameInputPage ---');
    console.log('Input value (before trim):', nameInput);
    console.log('Input value (after trim):', nameInput.trim());
    
    setUserName(nameInput.trim());
    setLocation('/role-selection');
  };

  const handleSkip = () => {
    console.log('--- NameInputPage ---');
    console.log('Skipping name input, setting userName to empty string.');
    setUserName('');
    setLocation('/role-selection');
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-blue-50 px-4 py-6">
      <motion.div
        className="text-center mb-8 max-w-md w-full"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold text-navy mb-4">
          {t('nameInput.title')}
        </h1>
        <p className="text-slate-600 text-lg sm:text-xl mb-8">
          {t('nameInput.subtitle')}
        </p>

        <div className="space-y-4 mb-8">
          <Label htmlFor="userNameInput" className="sr-only">
            {t('nameInput.label')}
          </Label>
          <Input
            id="userNameInput"
            type="text"
            placeholder={t('nameInput.placeholder')}
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            className="w-full text-center text-lg py-3"
          />
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <Button
            onClick={handleContinue}
            className="flex-1 bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
            disabled={!nameInput.trim()}
          >
            {t('nameInput.continueButton')}
          </Button>
          <Button
            onClick={handleSkip}
            variant="outline"
            className="flex-1 px-8 py-3 rounded-xl text-lg font-semibold transition-all duration-300 shadow-lg hover:shadow-xl transform hover:scale-105"
          >
            {t('nameInput.skipButton')}
          </Button>
        </div>
      </motion.div>
    </div>
  );
}