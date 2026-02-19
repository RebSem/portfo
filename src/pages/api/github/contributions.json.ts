import type { APIRoute } from 'astro';
import { githubUsername } from '../../../data/site-content';
import { getGithubContributions } from '../../../lib/github';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const contributions = await getGithubContributions(githubUsername);

    return new Response(JSON.stringify(contributions), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=3600, stale-while-revalidate=86400',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        error: 'GitHub contributions are unavailable',
        message,
      }),
      {
        status: 503,
        headers: {
          'Content-Type': 'application/json; charset=utf-8',
          'Cache-Control': 'no-store',
        },
      },
    );
  }
};
