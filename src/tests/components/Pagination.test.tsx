import { describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { Pagination } from '@/components/Pagination/Pagination';

describe('Pagination', () => {
  it('disables Previous on the first page', () => {
    render(<Pagination page={1} totalPages={9} onPrevious={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /next/i })).toBeEnabled();
  });

  it('disables Next on the last page', () => {
    render(<Pagination page={9} totalPages={9} onPrevious={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByRole('button', { name: /next/i })).toBeDisabled();
    expect(screen.getByRole('button', { name: /previous/i })).toBeEnabled();
  });

  it('calls onNext / onPrevious when clicked', async () => {
    const user = userEvent.setup();
    const onNext = vi.fn();
    const onPrevious = vi.fn();
    render(<Pagination page={2} totalPages={9} onPrevious={onPrevious} onNext={onNext} />);

    await user.click(screen.getByRole('button', { name: /next/i }));
    await user.click(screen.getByRole('button', { name: /previous/i }));

    expect(onNext).toHaveBeenCalledOnce();
    expect(onPrevious).toHaveBeenCalledOnce();
  });

  it('shows the current page and total', () => {
    render(<Pagination page={3} totalPages={9} onPrevious={vi.fn()} onNext={vi.fn()} />);
    expect(screen.getByText('Page 3 / 9')).toBeInTheDocument();
  });
});
