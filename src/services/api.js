// ─── n8n Webhook URLs ────────────────────────────────────────────
// These go through Vite's dev proxy (/api → cohort2pod3.app.n8n.cloud)
// to avoid CORS issues. Update vite.config.js if the host changes.
const WEBHOOK_GENERATE_DRAFTS = '/api/webhook-test/content-submission';
const WEBHOOK_REGENERATE_DRAFTS = '/api/webhook-test/regenerate-drafts';
const WEBHOOK_PUBLISH_DRAFT = '/api/webhook-test/draft-selection';

// ─── API Helpers ─────────────────────────────────────────────────

/**
 * POST to the draft-generation webhook.
 * @param {{ submission_type: 'text'|'url', content_input: string }} payload
 * @returns {Promise<{ status: string, draft_a: string, draft_b: string, draft_c: string }>}
 */
export async function generateDrafts(payload) {
  const res = await fetch(WEBHOOK_GENERATE_DRAFTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Draft generation failed (${res.status})`);
  }

  let data = await res.json();

  if (Array.isArray(data)) {
    data = data[0];
  }

  if (data.status === 'error' || data.error) {
    throw new Error(data.message || data.error || 'Unexpected response from server');
  }

  return data;
}

/**
 * POST to the regenerate-drafts webhook.
 * @param {{ submission_record_id: string, feedback: string }} payload
 * @returns {Promise<{ status: string, draft_1: string, draft_2: string, draft_3: string, record_id: string }>}
 */
export async function regenerateDrafts(payload) {
  const res = await fetch(WEBHOOK_REGENERATE_DRAFTS, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Regeneration failed (${res.status})`);
  }

  let data = await res.json();

  if (Array.isArray(data)) {
    data = data[0];
  }

  if (data.status === 'error' || data.error) {
    throw new Error(data.message || data.error || 'Unexpected response from server');
  }

  return data;
}

/**
 * POST to the publish / schedule webhook.
 * @param {{ submission_record_id: string, selected_draft_text: string, action: 'publish_now'|'schedule', scheduled_time: string }} payload
 * @returns {Promise<{ status: string }>}
 */
export async function publishDraft(payload) {
  const res = await fetch(WEBHOOK_PUBLISH_DRAFT, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (!res.ok) {
    throw new Error(`Publishing failed (${res.status})`);
  }

  let data = await res.json();
  
  if (Array.isArray(data)) {
    data = data[0];
  }

  if (data.status === 'error' || data.error) {
    throw new Error(data.message || data.error || 'Publishing failed');
  }

  return data;
}
