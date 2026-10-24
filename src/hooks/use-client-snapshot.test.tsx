import { render, renderHook, screen } from '@/lib/testing-library';
import { renderToString } from 'react-dom/server';
import { describe, expect, it } from 'vitest';
import { useClientSnapshot } from './use-client-snapshot';

function Platform() {
  const value = useClientSnapshot(
    () => 'client',
    () => 'server',
  );
  return <p>{value}</p>;
}

describe('useClientSnapshot', () => {
  it('returns the client value in the browser', () => {
    const { result } = renderHook(() =>
      useClientSnapshot(
        () => 'client',
        () => 'server',
      ),
    );
    expect(result.current).toBe('client');
  });

  it('returns the server value when rendered on the server', () => {
    const server = document.createElement('div');
    server.innerHTML = renderToString(<Platform />);
    expect(server).toHaveTextContent('server');
  });

  it('renders the client value after mounting', () => {
    render(<Platform />);
    expect(screen.getByText('client')).toBeInTheDocument();
  });
});
