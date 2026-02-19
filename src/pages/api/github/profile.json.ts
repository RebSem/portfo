import type { APIRoute } from 'astro';
import { githubUsername } from '../../../data/site-content';
import { getGithubProfile } from '../../../lib/github';

export const prerender = false;

export const GET: APIRoute = async () => {
  try {
    const profile = await getGithubProfile(githubUsername);
    return new Response(JSON.stringify(profile), {
      status: 200,
      headers: {
        'Content-Type': 'application/json; charset=utf-8',
        'Cache-Control': 'public, max-age=300',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return new Response(
      JSON.stringify({
        error: 'GitHub profile is unavailable',
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
