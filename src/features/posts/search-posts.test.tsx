import { render, screen, userEvent, within } from '@/lib/testing-library';
import { describe, expect, it, vi } from 'vitest';
import { SearchPosts } from './search-posts';

const posts = [
  { slug: 'react', title: 'React Hooks', date: '2024-05-10', excerpt: '' },
  { slug: 'new-year', title: 'New Year', date: '2024-01-01', excerpt: '' },
  { slug: 'css', title: 'CSS Grid', date: '2023-07-02', excerpt: '' },
  { slug: 'old', title: 'Old React', date: '2021-03-03', excerpt: '' },
];

function renderSearch() {
  const user = userEvent.setup();
  render(<SearchPosts initialPosts={posts} />);
  return {
    user,
    input: screen.getByRole('searchbox', { name: 'Search posts' }),
  };
}

function yearGroups() {
  const lists = screen.getAllByRole('list');
  return screen.getAllByRole('heading', { level: 2 }).map((heading, index) => ({
    year: heading.textContent,
    titles: within(lists[index])
      .getAllByRole('link')
      .map((link) => link.textContent),
  }));
}

describe('SearchPosts', () => {
  it('groups posts by year, newest year first', () => {
    renderSearch();
    expect(yearGroups()).toEqual([
      { year: '2024', titles: ['React Hooks', 'New Year'] },
      { year: '2023', titles: ['CSS Grid'] },
      { year: '2021', titles: ['Old React'] },
    ]);
  });

  it('groups by UTC year so Jan 1 posts stay in their year west of UTC', () => {
    vi.stubEnv('TZ', 'America/Sao_Paulo');
    renderSearch();
    expect(yearGroups()[0]).toEqual({
      year: '2024',
      titles: ['React Hooks', 'New Year'],
    });
  });

  it('filters posts by title, ignoring case', async () => {
    const { user, input } = renderSearch();
    await user.type(input, 'rEaCt');
    expect(yearGroups()).toEqual([
      { year: '2024', titles: ['React Hooks'] },
      { year: '2021', titles: ['Old React'] },
    ]);
    expect(screen.getByRole('status')).toHaveTextContent('2 posts found');
  });

  it('announces a single result without plural', async () => {
    const { user, input } = renderSearch();
    await user.type(input, 'grid');
    expect(screen.getByRole('status')).toHaveTextContent('1 post found');
  });

  it('announces nothing before searching', () => {
    renderSearch();
    expect(screen.getByRole('status')).toBeEmptyDOMElement();
  });

  it('shows an empty state naming the query when nothing matches', async () => {
    const { user, input } = renderSearch();
    await user.type(input, 'vue');
    expect(screen.getByText('No posts found for "vue"')).toBeInTheDocument();
    expect(screen.getByRole('status')).toHaveTextContent('0 posts found');
    expect(screen.queryByRole('heading')).not.toBeInTheDocument();
  });

  it('shows a generic empty state without posts', () => {
    render(<SearchPosts initialPosts={[]} />);
    expect(screen.getByText('No posts found')).toBeInTheDocument();
  });
});
