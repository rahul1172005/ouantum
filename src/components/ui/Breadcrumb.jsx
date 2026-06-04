import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

export function Breadcrumb({ crumbs }) {
  // crumbs = [{ label, href }] — last item is current page (no href)
  return (
    <nav className="flex items-center gap-1 text-[12px] text-text-muted mb-4">
      {crumbs.map((crumb, i) => (
        <span key={i} className="flex items-center gap-1">
          {i > 0 && <ChevronRight className="w-3 h-3 flex-shrink-0" />}
          {crumb.href ? (
            <Link href={crumb.href} className="hover:text-text-primary transition-colors">
              {crumb.label}
            </Link>
          ) : (
            <span className="text-text-primary font-medium">{crumb.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}
