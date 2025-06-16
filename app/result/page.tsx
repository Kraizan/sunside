import { Suspense } from 'react';
import Navbar from '@/components/Navbar';
import ResultContent from './ResultContent';

export default function ResultPageWrapper() {
  return (
    <main>
      <Navbar />
      <Suspense fallback={<div>Loading results…</div>}>
        <ResultContent />
      </Suspense>
    </main>
  );
}
