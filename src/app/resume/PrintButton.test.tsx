import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { PrintButton } from './PrintButton';

const PAGE_TITLE = 'Resume | Helder Burato Berto';

const clickPrint = async () => {
  render(<PrintButton />);
  await userEvent.click(
    screen.getByRole('button', { name: 'Print / Save as PDF' }),
  );
};

beforeEach(() => {
  document.title = PAGE_TITLE;
});

describe('PrintButton', () => {
  it('prints with the PDF filename as the document title', async () => {
    let titleWhilePrinting = '';
    const print = vi.fn(() => {
      titleWhilePrinting = document.title;
    });
    vi.stubGlobal('print', print);

    await clickPrint();

    expect(print).toHaveBeenCalledOnce();
    expect(titleWhilePrinting).toBe('Helder-Burato-Berto-Resume');
  });

  it('restores the page title after printing', async () => {
    vi.stubGlobal('print', vi.fn());

    await clickPrint();
    window.dispatchEvent(new Event('afterprint'));

    expect(document.title).toBe(PAGE_TITLE);
  });

  it('stops restoring the title once printing is done', async () => {
    vi.stubGlobal('print', vi.fn());

    await clickPrint();
    window.dispatchEvent(new Event('afterprint'));
    document.title = 'Changed later';
    window.dispatchEvent(new Event('afterprint'));

    expect(document.title).toBe('Changed later');
  });
});
