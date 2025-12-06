import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  hasNext: boolean;
  hasPrev: boolean;
}

export function Pagination({ currentPage, onPageChange, hasNext, hasPrev }: PaginationProps) {
  return (
    <div className="flex justify-center items-center gap-4 mt-8 mb-12">
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={!hasPrev}
        className="h-10 w-10 rounded-full"
        data-testid="button-prev"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <span className="font-mono text-sm text-muted-foreground min-w-[60px] text-center">
        Page {currentPage + 1}
      </span>
      
      <Button
        variant="outline"
        size="icon"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={!hasNext}
        className="h-10 w-10 rounded-full"
        data-testid="button-next"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
