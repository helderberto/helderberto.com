import { render, screen, userEvent } from '@/lib/testing-library';
import { CommandPalette } from './command-palette';

export const posts = Array.from({ length: 6 }, (_, index) => ({
  slug: `post-${index + 1}`,
  title: `Post ${index + 1}`,
  date: '2024-01-01',
  excerpt: '',
}));

export function renderPalette() {
  const user = userEvent.setup();
  render(<CommandPalette posts={posts} />);
  return {
    user,
    dialog: screen.getByRole<HTMLDialogElement>('dialog', { hidden: true }),
    input: screen.getByRole('combobox', {
      name: 'Search commands and posts',
      hidden: true,
    }),
  };
}

export async function openPalette() {
  const view = renderPalette();
  await view.user.click(
    screen.getByRole('button', { name: 'Open command palette' }),
  );
  await view.user.click(view.input);
  return view;
}

export function optionLabels() {
  return screen.getAllByRole('option').map((option) => option.textContent);
}

export function selectedOption() {
  return screen.getByRole('option', { selected: true });
}
