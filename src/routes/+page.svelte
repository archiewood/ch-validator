<script lang="ts">
	import { validate } from '@polyglot-sql/sdk';

	let sql = $state('select 1');
	let validationResult = $derived(validate(sql, 'clickhouse'));
</script>

<svelte:head>
	<link rel="preconnect" href="https://fonts.googleapis.com" />
	<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin="anonymous" />
	<link href="https://fonts.googleapis.com/css2?family=Outfit:wght@300;400;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<div class="page">
	<div class="grain"></div>

	<main>
		<header>
			<h1>ClickHouse Validator</h1>
			<p class="subtitle">Real-time SQL syntax checking</p>
		</header>

		<div class="editor-container" class:is-valid={validationResult.valid} class:is-invalid={!validationResult.valid}>
			<div class="editor-chrome">
				<div class="status-dot" class:valid={validationResult.valid} class:invalid={!validationResult.valid}></div>
				<span class="editor-label">clickhouse</span>
				<span class="line-count">{sql.split('\n').length} {sql.split('\n').length === 1 ? 'line' : 'lines'}</span>
			</div>
			<textarea
				id="sql-input"
				bind:value={sql}
				rows="10"
				spellcheck="false"
				placeholder="Enter ClickHouse SQL..."
			></textarea>
		</div>

		<div class="result-panel" class:valid={validationResult.valid} class:invalid={!validationResult.valid}>
			<div class="result-header">
				<div class="result-status">
					{#if validationResult.valid}
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M3.5 8.5L6.5 11.5L12.5 4.5" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>
						</svg>
						<span>Valid</span>
					{:else}
						<svg width="16" height="16" viewBox="0 0 16 16" fill="none">
							<path d="M4.5 4.5L11.5 11.5M11.5 4.5L4.5 11.5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
						</svg>
						<span>Invalid</span>
					{/if}
				</div>
				{#if validationResult.errors.length > 0}
					<span class="error-count">{validationResult.errors.length} {validationResult.errors.length === 1 ? 'issue' : 'issues'}</span>
				{/if}
			</div>

			{#if validationResult.errors.length > 0}
				<ul>
					{#each validationResult.errors as error, i}
						<li style="animation-delay: {i * 40}ms">
							<div class="error-row">
								<span class="badge {error.severity}">{error.code}</span>
								<span class="error-message">{error.message}</span>
							</div>
							{#if error.line != null}
								<span class="location">
									Ln {error.line}{#if error.column != null}, Col {error.column}{/if}
								</span>
							{/if}
						</li>
					{/each}
				</ul>
			{/if}
		</div>

		<footer>
			<span>powered by polyglot-sql</span>
		</footer>
	</main>
</div>

<style>
	:root {
		--amber: #E5A811;
		--amber-dim: #8a6a1a;
		--surface-0: #08080a;
		--surface-1: #0e0e12;
		--surface-2: #15151b;
		--surface-3: #1c1c24;
		--border: #1e1e28;
		--border-hover: #2a2a38;
		--text-primary: #dcdce0;
		--text-secondary: #6b6b7b;
		--text-tertiary: #43434f;
		--green: #34D399;
		--green-dim: #0d3b2a;
		--red: #F87171;
		--red-dim: #3b1418;
		--warning-yellow: #FBBF24;
		--warning-dim: #3b2f11;
		--mono: 'JetBrains Mono', 'SF Mono', 'Cascadia Code', monospace;
		--sans: 'Outfit', system-ui, sans-serif;
	}

	:global(*) {
		box-sizing: border-box;
	}

	:global(body) {
		font-family: var(--sans);
		margin: 0;
		background: var(--surface-0);
		color: var(--text-primary);
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
	}

	.page {
		position: relative;
		min-height: 100vh;
		overflow: hidden;
	}

	.grain {
		position: fixed;
		inset: 0;
		background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.03'/%3E%3C/svg%3E");
		pointer-events: none;
		z-index: 0;
	}

	main {
		position: relative;
		z-index: 1;
		max-width: 680px;
		margin: 0 auto;
		padding: 3.5rem 1.5rem 2rem;
	}

	/* ---- Header ---- */
	header {
		margin-bottom: 2.5rem;
	}

	h1 {
		font-family: var(--sans);
		font-size: 1.35rem;
		font-weight: 600;
		letter-spacing: -0.02em;
		margin: 0;
		color: var(--amber);
	}

	.subtitle {
		font-size: 0.8rem;
		font-weight: 300;
		color: var(--text-secondary);
		margin: 0;
		letter-spacing: 0.01em;
	}

	/* ---- Editor ---- */
	.editor-container {
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface-1);
		overflow: hidden;
		transition: border-color 0.3s ease, box-shadow 0.3s ease;
	}

	.editor-container:focus-within {
		border-color: var(--border-hover);
	}

	.editor-container.is-valid:focus-within {
		border-color: color-mix(in srgb, var(--green) 30%, var(--border));
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--green) 8%, transparent),
					0 8px 40px -12px rgba(52, 211, 153, 0.06);
	}

	.editor-container.is-invalid:focus-within {
		border-color: color-mix(in srgb, var(--red) 25%, var(--border));
		box-shadow: 0 0 0 1px color-mix(in srgb, var(--red) 6%, transparent),
					0 8px 40px -12px rgba(248, 113, 113, 0.06);
	}

	.editor-chrome {
		display: flex;
		align-items: center;
		gap: 0.6rem;
		padding: 0.6rem 1rem;
		border-bottom: 1px solid var(--border);
		background: var(--surface-2);
	}

	.status-dot {
		width: 8px;
		height: 8px;
		border-radius: 50%;
		background: var(--text-tertiary);
		transition: background 0.3s ease, box-shadow 0.3s ease;
	}

	.status-dot.valid {
		background: var(--green);
		box-shadow: 0 0 6px color-mix(in srgb, var(--green) 50%, transparent);
	}

	.status-dot.invalid {
		background: var(--red);
		box-shadow: 0 0 6px color-mix(in srgb, var(--red) 40%, transparent);
	}

	.editor-label {
		font-family: var(--mono);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-secondary);
		text-transform: uppercase;
		letter-spacing: 0.06em;
	}

	.line-count {
		margin-left: auto;
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--text-tertiary);
	}

	textarea {
		display: block;
		width: 100%;
		font-family: var(--mono);
		font-size: 0.88rem;
		font-weight: 400;
		line-height: 1.7;
		padding: 1rem 1.15rem;
		border: none;
		background: transparent;
		color: var(--text-primary);
		resize: vertical;
		tab-size: 2;
		min-height: 160px;
	}

	textarea::placeholder {
		color: var(--text-tertiary);
	}

	textarea:focus {
		outline: none;
	}

	/* ---- Result Panel ---- */
	.result-panel {
		margin-top: 1rem;
		border: 1px solid var(--border);
		border-radius: 12px;
		background: var(--surface-1);
		overflow: hidden;
		transition: border-color 0.3s ease;
	}

	.result-header {
		display: flex;
		align-items: center;
		justify-content: space-between;
		padding: 0.7rem 1rem;
		border-bottom: 1px solid transparent;
		transition: border-color 0.2s ease;
	}

	.result-panel.invalid .result-header,
	.result-panel.valid .result-header {
		border-bottom-color: var(--border);
	}

	.result-panel.valid .result-header {
		border-bottom-color: transparent;
	}

	.result-status {
		display: flex;
		align-items: center;
		gap: 0.45rem;
		font-weight: 600;
		font-size: 0.85rem;
		letter-spacing: -0.01em;
	}

	.result-panel.valid .result-status {
		color: var(--green);
	}

	.result-panel.invalid .result-status {
		color: var(--red);
	}

	.error-count {
		font-family: var(--mono);
		font-size: 0.7rem;
		font-weight: 500;
		color: var(--text-tertiary);
		background: var(--surface-3);
		padding: 0.2rem 0.55rem;
		border-radius: 6px;
	}

	/* ---- Error List ---- */
	ul {
		list-style: none;
		padding: 0;
		margin: 0;
	}

	li {
		padding: 0.65rem 1rem;
		border-top: 1px solid var(--border);
		display: flex;
		align-items: baseline;
		justify-content: space-between;
		gap: 0.75rem;
		animation: slideIn 0.15s ease-out both;
	}

	li:first-child {
		border-top: none;
	}

	@keyframes slideIn {
		from {
			opacity: 0;
			transform: translateY(4px);
		}
		to {
			opacity: 1;
			transform: translateY(0);
		}
	}

	.error-row {
		display: flex;
		align-items: baseline;
		gap: 0.5rem;
		min-width: 0;
	}

	.badge {
		flex-shrink: 0;
		font-family: var(--mono);
		font-size: 0.65rem;
		font-weight: 600;
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
		letter-spacing: 0.02em;
	}

	.badge.error {
		background: var(--red-dim);
		color: var(--red);
	}

	.badge.warning {
		background: var(--warning-dim);
		color: var(--warning-yellow);
	}

	.error-message {
		font-size: 0.82rem;
		color: var(--text-primary);
		line-height: 1.45;
	}

	.location {
		flex-shrink: 0;
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--text-tertiary);
		background: var(--surface-3);
		padding: 0.15rem 0.45rem;
		border-radius: 4px;
	}

	/* ---- Footer ---- */
	footer {
		margin-top: 2.5rem;
		text-align: center;
	}

	footer span {
		font-family: var(--mono);
		font-size: 0.65rem;
		color: var(--text-tertiary);
		letter-spacing: 0.04em;
	}
</style>
